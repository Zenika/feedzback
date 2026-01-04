# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FeedZback is a feedback management application for requesting and giving feedback to colleagues.
It's built as a monorepo with an Angular frontend, NestJS backend, and Docusaurus documentation site.

## Repository Structure

- `/client` - Angular frontend
- `/server` - NestJS backend API
- `/docs-source` - Docusaurus documentation source
- `/docs` - Generated documentation (published to GitHub Pages)
- `/usage-analytics` - Usage analytics tooling

## Common Commands

### Client (Angular)

```bash
cd client

# Development
npm start                     # Start dev server (French locale)
npm run start:en              # Start dev server (English locale)
npm run start:emulators:watch # Start dev server configured to connect to Firebase emulators

# Building
npm run build                 # Production build (all locales)
npm run build:dev             # Development build for remote server
npm run build:staging         # Staging build
npm run build:production      # Production build

# Run full stack with Firebase emulators
npm run stack:emulators:watch # Run Firebase emulators + server (watch mode) + client (watch mode) concurrently
npm run stack:emulators       # Run Firebase emulators + server (built mode) + client (built mode) concurrently

# Testing
npm run e2e:install           # Install Playwright browsers
npm run e2e:test              # Run Playwright e2e tests
npm run e2e:ui                # Run Playwright e2e tests in interactive UI mode

# Code quality
npm run lint                  # Lint and auto-fix
npm run lint:ci               # Lint without fixing (CI mode)
npm run format                # Format code with Prettier
npm run format:check          # Check formatting

# Internationalization
npm run extract-i18n          # Extract i18n messages to JSON
```

### Server (NestJS)

```bash
cd server

# Development
npm run start                 # Start dev server without watch mode
npm run start:dev             # Start dev server with watch mode
npm run start:emulators:watch # Start dev server configured to connect to Firebase emulators
npm run start:emulators       # Build TypeScript to dist/ and start app configured to connect to Firebase emulators

# Building
npm run build                 # Build TypeScript to dist/

# Testing (but not used)
npm run test                  # Run Jest unit tests
npm run test:watch            # Run tests in watch mode
npm run test:cov              # Run tests with coverage
npm run test:e2e              # Run e2e tests

# Code quality
npm run lint                  # Lint and auto-fix
npm run lint:ci               # Lint without fixing (CI mode)
npm run format                # Format code with Prettier
```

### Documentation

```bash
cd docs-source

npm start                    # Start Docusaurus dev server
npm run build                # Build static documentation to ../docs
```

## Architecture Overview

### Client Architecture (Angular)

**Component Model:**

- Uses modern **standalone components** (no NgModules)
- Feature-based directory structure with lazy-loaded routes
- Signal-based reactive state management (no NgRx/Akita)

**State Management:**

- Services with `providedIn: 'root'` for global state
- Angular signals for reactive primitives
- Key services: `FirebaseService`, `AuthService`, `FeedbackService`, `SessionService`, `EmployeeService`, `ThemeService`, `LanguageService`

**Routing:**

- Lazy loading via `loadChildren()` and `loadComponent()`
- Route guards: `authGuard`, `signInGuard`, `managerGuard`, `unsavedFormGuard`
- Route resolvers for data pre-fetching
- View transitions enabled for smooth navigation

**HTTP Communication:**

- `authInterceptor` - Attaches Firebase ID token to all API requests
- `loadingInterceptor` - Tracks pending requests for loading spinner
- Base URL from environment config (`environment.apiBaseUrl`)

**Key Features:**

- **i18n**: Build-time localization (French/English) with separate bundles per locale
- **Theming**: Dark/light mode with system preference detection
- **Session management**: Auto-logout after idle period with warning

**Environment Modes:**

- `environment.dev-local.ts` - Local development with local server
- `environment.dev-local-emulators.ts` - Local development with Firebase emulators
- `environment.dev-remote.ts` - Development with remote server
- `environment.staging.ts` - Staging environment
- `environment.ts` - Production

### Server Architecture (NestJS)

**Module Organization:**

- Feature modules: `FeedbackModule`, `EmployeeModule`, `PeopleModule`
- Core infrastructure: `AuthModule`, `FirebaseModule`, `EmailModule`, `CryptoModule`

**Middleware Chain:**

1. `ContextMiddleware` - Captures locale cookie and base URL from request
2. `AuthMiddleware` - Verifies Firebase ID token from Authorization header

**Authentication:**

- REQUEST-scoped `AuthService` stores per-request user data
- `AuthGuard` protects routes requiring authentication
- Token verification via Firebase Admin SDK

**Database (Firestore):**

- Collections: `feedback`, `feedbackRequestToken`, `feedbackDraft`, `employee`
- **Encryption at rest**: Sensitive fields (context, positive, negative, comment) are encrypted
- Service pattern: `*DbService` classes abstract database operations

**Email System:**

- Mailgun integration via `EmailModule`
- Templated emails with EJS
- i18n support - reads locale from cookie to send emails in user's language

### Authentication Flow

1. Client signs in via Firebase Auth (Google OAuth ; or email/password for dev only)
2. Client receives Firebase ID token
3. Client includes token in `Authorization: Bearer <token>` header
4. Server middleware verifies token with Firebase Admin SDK
5. Server stores decoded user email in REQUEST-scoped `AuthService`
6. Controllers access user email via `this.authService.userEmail`

**Session Management:**

- `SessionIdleService` detects user inactivity
- Auto sign-out after idle period
- Warning dialog before timeout

### Data Flow Patterns

**Feedback Request Flow:**

1. User requests feedback via `FeedbackService.request()` → POST `/feedback/request`
2. Server validates, creates Firestore doc, generates token, sends email
3. Recipient clicks email link with token
4. Client validates token → POST `/feedback/validate-token`
5. Recipient gives feedback via form → POST `/feedback/give`
6. Server encrypts sensitive fields, saves to Firestore, sends notification email

**Manager Feature:**

- Employees can share feedback with their manager
- Manager relationships stored in `employee` collection
- Managers access team feedback via `/manager` routes
- Access controlled by `managerGuard`

### i18n Implementation

**Client:**

- Angular localize with build-time translation
- Two locales: `fr` (source), `en`
- Separate builds for each locale with base href: `/fr/`, `/en/`
- Language switching redirects to alternate locale URL

**Server:**

- Reads `app-locale-id` cookie from client
- Uses locale for email templates (EJS)
- Email service sends emails in user's language

### Firebase Integration

**Client SDK:**

- Authentication (Google OAuth, email/password for dev only)
- Firestore for real-time data
- Optional emulator mode for local development

**Server SDK:**

- Firebase Admin SDK for token verification
- Firestore for database operations

**Emulator Mode:**

- Set via environment variables: `FIREBASE_AUTH_EMULATOR_HOST`, `FIRESTORE_EMULATOR_HOST`
- Client connects to emulators in `environment.dev-local-emulators.ts`
- Use `stack:emulators:watch` or `stack:emulators` npm scripts

## Development Workflow

### Local Development with Emulators

**Recommended for full-stack development:**

```bash
cd client
npm run stack:emulators:watch
```

This runs:

- Firebase emulators (Auth on port 9099, Firestore on port 8080)
- Server in emulator mode
- Client dev server

**Emulator data:**

- Seed data in `client/firebase-emulators-data/`
- Imported on emulator startup

### Running Individual Services

```bash
# Terminal 1 - Firebase emulators
cd client
npm run firebase:emulators:watch

# Terminal 2 - Server
cd server
npm run start:emulators:watch

# Terminal 3 - Client
cd client
npm run start:emulators:watch
```

### E2E Testing

**Setup:**

```bash
cd client
npm run e2e:install     # Install Playwright browsers
```

**Run tests:**

```bash
npm run stack:emulators # Builds client, starts emulators + hosting (to serve client), builds and start server
npm run e2e:test        # In another terminal, run tests
```

**Interactive mode:**

```bash
npm run e2e:ui          # Run tests with Playwright UI
```

**Test structure:**

- Tests in `client/e2e/`
- Page Object Model pattern in `client/e2e/pages/`
- Uses Firebase emulators with seed data

### Testing a Single Test File

```bash
cd client
npx playwright test e2e/submit-requested-feedback.spec.ts
```

### Code Style

- ESLint with Prettier integration
- Prettier plugins: `organize-imports`, `tailwindcss`
- Run `npm run format` before committing
- CI checks with `npm run lint:ci` and `npm run format:check`

## Important Patterns & Conventions

### Client Patterns

**Standalone Components:**

```typescript
@Component({
  selector: 'app-example',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './example.component.html'
})
```

**Signal-based State:**

```typescript
export class ExampleService {
  private _data = signal<Data | null>(null);
  data = this._data.asReadonly();

  setData(data: Data) {
    this._data.set(data);
  }
}
```

**Route Guards:**

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.authenticated()) {
    router.navigate(["/sign-in"]);
    return false;
  }
  return true;
};
```

**HTTP Interceptors:**

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.idToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
```

### Server Patterns

**Controllers:**

```typescript
@Controller("feedback")
@UseGuards(AuthGuard)
export class FeedbackController {
  constructor(
    private readonly authService: AuthService, // REQUEST-scoped
    private readonly feedbackService: FeedbackService
  ) {}

  @Post("give")
  async giveFeedback(@Body() dto: GiveFeedbackDto) {
    const email = this.authService.userEmail;
    return this.feedbackService.give(email, dto);
  }
}
```

**Request-scoped Auth:**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private _userEmail: string | null = null;

  get userEmail(): string {
    if (!this._userEmail) {
      throw new UnauthorizedException();
    }
    return this._userEmail;
  }

  setUser(email: string) {
    this._userEmail = email;
  }
}
```

**Database Services:**

```typescript
@Injectable()
export class FeedbackDbService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(data: FeedbackData): Promise<string> {
    const db = this.firebaseService.firestore;
    const ref = await db.collection("feedback").add(data);
    return ref.id;
  }
}
```

## Special Considerations

### Encryption

- Sensitive feedback fields are encrypted before storing in Firestore
- `CryptoModule` provides encryption/decryption services
- Encryption key stored in server environment variables

### Locale Cookie

- Client sets `app-locale-id` cookie with current locale
- Server reads cookie to determine email language
- Cookie set by `LanguageService` on locale change

### Manager Permissions

- Employee-manager relationships stored in `employee` collection
- `managerGuard` checks if user has manager status
- Managers can only view feedback shared with them by their team

### Draft Auto-save

- Drafts (feedback) saved to localStorage every few seconds while typing
- Drafts restored when user returns to form

### Google Workspace Integration

- `PeopleModule` integrates with Google Directory API
- Requires service account credentials
- Fetches employee data for autocomplete and manager relationships

## Troubleshooting

### Firebase Emulator Connection Issues

- Ensure emulators are running: `npm run firebase:emulators:watch`
- Check environment variables: `FIREBASE_AUTH_EMULATOR_HOST`, `FIRESTORE_EMULATOR_HOST`
- Verify client uses `environment.dev-local-emulators.ts`

### CORS Errors

- Server sets CORS origin from environment variable
- Check `ALLOWED_ORIGIN` in server `.env`
- Ensure client uses correct API base URL

### Authentication Failures

- Verify Firebase ID token is being sent in Authorization header
- Check `AuthMiddleware` is applied to protected routes
- Ensure Firebase Admin SDK is initialized with correct credentials

### Build Errors

- Angular: Clear `.angular` cache and rebuild
- Server: Delete `dist/` and rebuild with `npm run build`
- Check TypeScript version matches in `package.json`

### E2E Test Failures

- Ensure emulators have seed data: `client/firebase-emulators-data/`
- Check emulator ports: Auth 9099, Firestore 8080, Hosting 5000
- Verify `stack:emulators` completes build before running tests
