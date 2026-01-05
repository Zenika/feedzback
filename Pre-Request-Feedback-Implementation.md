# Pre-Request Feedback Feature - Implementation Prompt

## Feature Overview

We're building a new way for employees to request feedback when they don't know the colleague's email upfront. Instead of specifying emails, the employee creates a shareable link that colleagues can use to provide their email and trigger the feedback request flow.

**Key Concept:** This feature splits the existing feedback request process into 2 steps:
1. Employee creates a shareable link (new feature)
2. Colleague uses link to provide their email → triggers existing feedback request flow

After step 2, the rest is identical to the existing email-based flow (colleague receives email with token, gives feedback via existing pages).

---

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ NEW FEATURE (Pre-Request Flow)                              │
└─────────────────────────────────────────────────────────────┘
Step 1: Employee (authenticated) fills form at /pre-request
        - Fields: message, shared (NO email field!)
        - Submits form

Step 2: Server creates feedbackPreRequestToken document
        - POST /feedback/pre-request
        - Document ID = generated token (Firestore auto-generated)
        - Fields: { receiverEmail, message, shared, expiresAt, usedBy: [] }
        - Returns { token: string }

Step 3: Client shows success page at /pre-request/success
        - Display full URL: constructed from window.location
        - Copy to clipboard button
        - "Retour à l'accueil" button

Step 4: Employee shares URL manually (Slack, Teams, etc.)

Step 5: Colleague (NOT logged in) visits /pre-request/token/:token

Step 6: Client validates token with server
        - GET /feedback/check-pre-request/:token
        - Returns: { receiverEmail: string, message: string, shared: boolean }
        - Or: BadRequestException(errorType)

Step 7: Client shows page with:
        - "De : receiverEmail"
        - "Message : message"
        - Form field: "Votre email" (no autocomplete)

Step 8: Colleague enters their email and submits
        - Client validation: email format, email ≠ receiverEmail
        - Server validation: all token checks

Step 9: Server receives { token, giverEmail }
        - POST /feedback/pre-request/email
        - Validates token (exists, not expired, not max uses, email not in usedBy)
        - Updates usedBy[] array
        - Calls requestInternal() to trigger existing flow

┌─────────────────────────────────────────────────────────────┐
│ EXISTING FEATURE (Feedback Request Flow) - REUSED          │
└─────────────────────────────────────────────────────────────┘
Step 10: Server (via requestInternal) creates:
         - feedback document (EXISTING)
         - feedbackRequestToken document (EXISTING)
         - Sends email to giverEmail with EXISTING token (EXISTING)

Step 11: Navigate to /pre-request/token-success
         - Message: "Un email vous a été envoyé contenant un lien pour donner votre feedback..."
         - No buttons (colleague is done)

Step 12: Colleague clicks email link with EXISTING token

Step 13: Colleague gives feedback (EXISTING FLOW)
```

---

## Firestore Schema

**New Collection:** `feedbackPreRequestToken`

**Document Structure:**
- Document ID: The token itself (Firestore auto-generated)
- Fields:
  ```typescript
  {
    receiverEmail: string;  // Employee who will receive the feedback
    message: string;        // Message to colleagues
    shared: boolean;        // Share with manager?
    expiresAt: number;      // Timestamp (Date.now() + 3 days)
    usedBy: string[];       // Array of emails that used this token
  }
  ```

**Constants:**
- Token expiration: 3 days
- Max uses: 20

---

## Routes (Client)

```typescript
// In app.routes.ts
{
  path: 'pre-request',
  canActivate: [authGuard],
  loadComponent: () => import('./pre-request/pre-request.component')
},
{
  path: 'pre-request/success',
  canActivate: [authGuard],
  loadComponent: () => import('./pre-request/pre-request-success/pre-request-success.component')
  // If no router state with token, redirect to '/'
},
{
  path: 'pre-request/token/:token',
  // NO authGuard - public route
  loadComponent: () => import('./pre-request/pre-request-token/pre-request-token.component')
},
{
  path: 'pre-request/token-success',
  // NO authGuard - public route
  loadComponent: () => import('./pre-request/pre-request-token-success/pre-request-token-success.component')
}
```

---

## Server Endpoints

### 1. Create Pre-Request Token
```
POST /feedback/pre-request
Protected: YES (@UseGuards(AuthGuard))

Request Body:
{
  message: string;
  shared: boolean;
}

Response:
{
  token: string;
}
```

### 2. Validate Pre-Request Token
```
GET /feedback/check-pre-request/:token
Protected: NO

Response (success):
{
  receiverEmail: string;
  message: string;
  shared: boolean;
}

Response (error):
BadRequestException(errorType)
```

### 3. Submit Email for Pre-Request
```
POST /feedback/pre-request/email
Protected: NO

Request Body:
{
  token: string;
  giverEmail: string;
}

Response:
Promise<void>

Validations (throw BadRequestException with error type):
- Token exists → 'invalid_token'
- Token not expired → 'token_expired'
- usedBy.length < 20 → 'token_max_uses_reached'
- Email not in usedBy[] → 'email_already_used'
- Valid email format → 'invalid_email'
- giverEmail ≠ receiverEmail → 'self_request_not_allowed'
```

---

## Error Types

Server returns `BadRequestException(errorType)` which translates to:
```json
{
  "message": "<errorType>",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Error types:**
- `invalid_token` - Token doesn't exist
- `token_expired` - Token expiresAt < Date.now()
- `token_max_uses_reached` - usedBy.length >= 20
- `email_already_used` - Email already in usedBy[]
- `invalid_email` - Email format invalid
- `self_request_not_allowed` - giverEmail === receiverEmail

**Client error messages (French, inline in component):**
```typescript
const errorMessages = {
  invalid_token: 'Le lien est invalide',
  token_expired: 'Le lien a expiré',
  token_max_uses_reached: 'Ce lien a atteint le nombre maximum d\'utilisations',
  email_already_used: 'Cet email a déjà été utilisé avec ce lien',
  invalid_email: 'L\'email est invalide',
  self_request_not_allowed: 'Vous ne pouvez pas vous demander un feedback à vous-même',
};
```

---

## Server Implementation

### Constants (server/src/feedback/feedback.config.ts)

Add:
```typescript
export const PRE_REQUEST_TOKEN_EXPIRATION_DAYS = 3;
export const PRE_REQUEST_TOKEN_MAX_USES = 20;
```

### Types (server/src/feedback/feedback-db/feedback-db.types.ts)

Add:
```typescript
export type FeedbackPreRequestToken = {
  receiverEmail: string;
  message: string;
  shared: boolean;
  expiresAt: number;
  usedBy: string[];
};
```

### Collection Config (server/src/feedback/feedback-db/feedback-db.config.ts)

Add to `Collection` enum:
```typescript
export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
  feedbackDraft: 'feedbackDraft',
  feedbackPreRequestToken: 'feedbackPreRequestToken', // NEW
} as const;
```

### DTOs (server/src/feedback/feedback.dto.ts)

Add:
```typescript
export class CreatePreRequestDto {
  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @MaxLength(SMALL_MAX_LENGTH)
  message!: string;

  @IsBoolean()
  shared!: boolean;
}

export class SubmitPreRequestEmailDto {
  @IsString()
  token!: string;

  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  giverEmail!: string;
}
```

### Database Service (server/src/feedback/feedback-db/feedback-db.service.ts)

Add collection getter:
```typescript
private get feedbackPreRequestTokenCollection() {
  return this.firebaseService.db.collection(Collection.feedbackPreRequestToken);
}
```

Add methods:
```typescript
async createPreRequest(receiverEmail: string, message: string, shared: boolean): Promise<string> {
  const expiresAt = Date.now() + (PRE_REQUEST_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
  const preRequestToken: FeedbackPreRequestToken = {
    receiverEmail,
    message,
    shared,
    expiresAt,
    usedBy: [],
  };
  const docRef = await this.feedbackPreRequestTokenCollection.add(preRequestToken);
  return docRef.id; // This is the token
}

async checkPreRequest(token: string): Promise<Pick<FeedbackPreRequestToken, 'receiverEmail' | 'message' | 'shared'> | null> {
  const doc = await this.feedbackPreRequestTokenCollection.doc(token).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data() as FeedbackPreRequestToken;
  return {
    receiverEmail: data.receiverEmail,
    message: data.message,
    shared: data.shared,
  };
}

async validateAndUsePreRequestToken(token: string, giverEmail: string): Promise<{
  receiverEmail: string;
  message: string;
  shared: boolean;
} | { error: string }> {
  const doc = await this.feedbackPreRequestTokenCollection.doc(token).get();

  if (!doc.exists) {
    return { error: 'invalid_token' };
  }

  const data = doc.data() as FeedbackPreRequestToken;

  if (Date.now() > data.expiresAt) {
    return { error: 'token_expired' };
  }

  if (data.usedBy.length >= PRE_REQUEST_TOKEN_MAX_USES) {
    return { error: 'token_max_uses_reached' };
  }

  if (data.usedBy.includes(giverEmail)) {
    return { error: 'email_already_used' };
  }

  if (giverEmail === data.receiverEmail) {
    return { error: 'self_request_not_allowed' };
  }

  // Add email to usedBy array
  await this.feedbackPreRequestTokenCollection.doc(token).update({
    usedBy: [...data.usedBy, giverEmail],
  });

  return {
    receiverEmail: data.receiverEmail,
    message: data.message,
    shared: data.shared,
  };
}
```

### Controller (server/src/feedback/feedback.controller.ts)

Add internal method (extract from existing `request()` method):
```typescript
private async requestInternal(
  receiverEmail: string,
  giverEmail: string,
  message: string,
  shared: boolean,
): Promise<string> {
  // Call FeedbackDbService.request() and EmailService (reuse existing logic)
  const tokenId = await this.feedbackDbService.request({
    giverEmail,
    receiverEmail,
    message,
    shared,
  });

  await this.emailService.sendFeedbackRequest(
    receiverEmail,
    giverEmail,
    message,
    tokenId,
  );

  return tokenId;
}
```

Refactor existing `request()` to use `requestInternal()`:
```typescript
@Post('request')
@UseGuards(AuthGuard)
async request(@Body() { recipient, message, shared }: FeedbackRequestDto) {
  const receiverEmail = this.authService.userEmail;
  const giverEmail = recipient;

  await this.requestInternal(receiverEmail, giverEmail, message, shared);
}
```

Add new endpoints:
```typescript
@Post('pre-request')
@UseGuards(AuthGuard)
async createPreRequest(@Body() dto: CreatePreRequestDto): Promise<{ token: string }> {
  const receiverEmail = this.authService.userEmail;
  const token = await this.feedbackDbService.createPreRequest(
    receiverEmail,
    dto.message,
    dto.shared,
  );
  return { token };
}

@Get('check-pre-request/:token')
async checkPreRequest(@Param('token') token: string) {
  const result = await this.feedbackDbService.checkPreRequest(token);
  if (!result) {
    throw new BadRequestException('invalid_token');
  }
  return result;
}

@Post('pre-request/email')
async submitPreRequestEmail(@Body() dto: SubmitPreRequestEmailDto): Promise<void> {
  const result = await this.feedbackDbService.validateAndUsePreRequestToken(
    dto.token,
    dto.giverEmail,
  );

  if ('error' in result) {
    throw new BadRequestException(result.error);
  }

  await this.requestInternal(
    result.receiverEmail,
    dto.giverEmail,
    result.message,
    result.shared,
  );
}
```

---

## Client Implementation

### Types (client/src/app/shared/feedback/feedback.types.ts)

Add:
```typescript
export type PreRequestTokenData = {
  receiverEmail: string;
  message: string;
  shared: boolean;
};

export type PreRequestResponse = {
  token: string;
};
```

### Service (client/src/app/shared/feedback/feedback.service.ts)

Add methods:
```typescript
preRequest(message: string, shared: boolean): Observable<PreRequestResponse> {
  return this.http.post<PreRequestResponse>(`${this.apiUrl}/pre-request`, { message, shared });
}

checkPreRequest(token: string): Observable<PreRequestTokenData> {
  return this.http.get<PreRequestTokenData>(`${this.apiUrl}/check-pre-request/${token}`);
}

preRequestEmail(token: string, giverEmail: string): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/pre-request/email`, { token, giverEmail });
}
```

### Folder Structure

```
client/src/app/pre-request/
  ├── pre-request.component.ts
  ├── pre-request.component.html
  ├── pre-request.component.scss
  ├── pre-request-success/
  │   ├── pre-request-success.component.ts
  │   ├── pre-request-success.component.html
  │   └── pre-request-success.component.scss
  ├── pre-request-token/
  │   ├── pre-request-token.component.ts
  │   ├── pre-request-token.component.html
  │   └── pre-request-token.component.scss
  └── pre-request-token-success/
      ├── pre-request-token-success.component.ts
      ├── pre-request-token-success.component.html
      └── pre-request-token-success.component.scss
```

### Components

#### 1. PreRequestComponent (`/pre-request`)
- **Similar to:** `RequestFeedbackComponent` but WITHOUT email autocomplete
- **Fields:**
  - `message` (textarea, required, maxLength: SMALL_MAX_LENGTH)
  - `shared` (checkbox)
- **Submit button:** "Créer le lien" or similar
- **On submit:**
  - Call `feedbackService.preRequest(message, shared)`
  - Navigate to `/pre-request/success` with router state `{ token }`
- **Use i18n attributes** (don't modify .xlf files)

#### 2. PreRequestSuccessComponent (`/pre-request/success`)
- **Similar to:** `GiveFeedbackSuccessComponent` / `RequestFeedbackSuccessComponent`
- **On init:**
  - Check router state for token
  - If no token, redirect to `/`
- **Display:**
  - Title: "Lien créé avec succès" or similar
  - Instruction: "Voici l'url que vous devez transmettre à vos collègues"
  - Full URL: Construct using `window.location.protocol`, `window.location.host`, and token
    ```typescript
    const fullUrl = `${window.location.protocol}//${window.location.host}/pre-request/token/${token}`;
    ```
  - Copy to clipboard button
- **Actions:**
  - "Retour à l'accueil" button → navigate to `/`

#### 3. PreRequestTokenComponent (`/pre-request/token/:token`)
- **On init:**
  - Get token from route params
  - Call `feedbackService.checkPreRequest(token)`
  - If error, display error message in component
  - If success, store receiverEmail, message, shared
- **Display:**
  - Title: "Demande de feedback"
  - "De : [receiverEmail]"
  - "Message : [message]"
  - Form field: "Votre email" (text input)
- **Validation:**
  - Required
  - Email format (`Validators.email`)
  - Custom validator: email ≠ receiverEmail
- **Submit button:** "Envoyer" or similar
- **On submit:**
  - Call `feedbackService.preRequestEmail(token, giverEmail)`
  - On success: Navigate to `/pre-request/token-success`
  - On error: Display error message inline (extract from `error.error.message`)
- **Error display:** Show inline in component using error type mapping

#### 4. PreRequestTokenSuccessComponent (`/pre-request/token-success`)
- **Display:**
  - Title: "Email envoyé" or similar
  - Message: "Un email vous a été envoyé contenant un lien pour donner votre feedback..."
  - No buttons (colleague is done)

---

## Implementation Details

### URL Construction
```typescript
const fullUrl = `${window.location.protocol}//${window.location.host}/pre-request/token/${token}`;
```

### Locale Handling
- Routes are locale-agnostic (`/pre-request/token/:token`)
- Angular automatically redirects based on browser locale (`/fr/` or `/en/`)
- No special handling needed

### Form Patterns
- Reuse existing form patterns from `RequestFeedbackComponent` and `GiveFeedbackComponent`
- Use existing validators
- Use existing styling

### i18n
- Focus on French only
- Add i18n attributes (`i18n`, `i18n-placeholder`, etc.)
- DO NOT modify `.xlf` files (user will run `npm run extract-i18n` later)

### Navigation
- Use router state for passing token from step 2 to step 3
- Redirect to `/` if accessing `/pre-request/success` without state
- Show errors inline for invalid tokens

---

## Implementation Order

1. **Server-side:**
   - Add constants to `feedback.config.ts`
   - Add types to `feedback-db.types.ts`
   - Add Collection enum value
   - Add DTOs to `feedback.dto.ts`
   - Add methods to `feedback-db.service.ts`
   - Refactor controller: extract `requestInternal()`, update `request()`, add new endpoints

2. **Test server:** Manually test endpoints with Postman/curl

3. **Client-side:**
   - Add types to `feedback.types.ts`
   - Add service methods to `feedback.service.ts`
   - Create components (folder structure)
   - Add routes to `app.routes.ts`

4. **Test client:** Manual testing in browser

---

## Notes

- **Firestore security:** No changes needed (all access via server)
- **Email templates:** No changes needed (reuse existing)
- **Loading states:** Handled by existing `loadingInterceptor`
- **Testing:** Manual testing only (no unit/e2e tests for now)
- **Future:** Employee list view of created pre-request tokens (not implementing now)

---

**This feature elegantly splits the feedback request into 2 steps while reusing 100% of the existing feedback flow after the colleague provides their email. Start with server implementation, then client. Good luck!**
