# FeedZback client

## Install packages from scratch

### Create Angular app

```shell
npm install -g @angular/cli

ng new client --style scss --view-encapsulation None --ssr false
```

### Add Localize

```shell
ng add @angular/localize
```

### Add Material

```shell
ng add @angular/material --theme custom --animations --typography
```

Move generated content (related to Material) from `src/styles.scss` to `src/styles/material.scss`.

Update `src/styles.scss`

```scss
@import './styles/material.scss';

html,
body {
  height: 100%;
}
body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
}
```

### Add Tailwind

```shell
npm install -D tailwindcss postcss autoprefixer
```

Add `tailwind.config.ts` file 

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],

  corePlugins: {
    // Warning: Tailwind "Preflight" breaks some Angular material components
    //
    // Learn more about this issue and a hack to solve it:
    //    https://github.com/tailwindlabs/tailwindcss/discussions/9993
    //
    // The hack is available here: `src/styles/tailwind.css`
    preflight: false,
  },

  theme: {
    extend: {},
  },

  plugins: [],
} satisfies Config;
```

Add `src/styles/tailwind.css` file

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update `src/styles.scss`

```scss
@import './styles/tailwind.css'
```

### Add ESLint and Prettier

```shell
ng add @angular-eslint/schematics

npm i -D prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-organize-imports prettier-plugin-tailwindcss
```

Update `.eslintrc.json` file

```json
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "warn",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```

Add `.prettierrc.json` file

```json
{
  "printWidth": 120,
  "singleQuote": true,
  "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

Add `.prettierignore` file

```txt
/.angular
/coverage
/dist
```

Add `package.json` scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### Using Jest instead of Karma/Jasmine

Remove all packages related to Karma and Jasmine.

```shell
npm i -D jest @types/jest @angular-builders/jest ts-node
```

Update `tsconfig.spec.json` and `tsconfig.json` files

```json
{
  "compilerOptions": {
    "types": ["jest"]
  }
}
```

(do the same for the `tsconfig.json` file, after it is used by your IDE)

Update `angular.json` file

```json
{
  "projects": {
    "client": {
      "architect": {
        "test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "configPath": "jest.config.ts"
          }
        }
      }
    }
  }
}
```

Add `jest.config.ts` file

```ts
import type { Config } from 'jest';

export default {
  passWithNoTests: true,
  setupFiles: ['./setup-jest.ts'],
} satisfies Config;
```

Add `setup-jest.ts` file

```ts
import '@angular/localize/init';
```

#### Add other packages

```shell
npm i @fontsource/nunito canvas-confetti firebase js-cookie material-symbols

npm i -D @types/canvas-confetti @types/js-cookie
```
