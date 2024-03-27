---
title: Client app
---

# Update client app

You can update the Angular framework dependencies by following the [instructions provided by Angular](https://angular.dev/update).
Other dependencies can be updated manually.

The rest of the document describes how to recreate all the dependencies from scratch.
This is very useful for understanding the links between dependencies.

## Create Angular app

```shell
npm install -g @angular/cli

ng new client --style scss --view-encapsulation None --ssr false
```

## Generate environments

```shell
ng generate environments
```

## Add Localize

```shell
ng add @angular/localize
```

## Add Material

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
  font-family: Nunito, sans-serif;
}
```

:::note
`Nunito` font dependency is listed in [other packages](#add-other-packages) below.
:::

## Add Tailwind

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
@import './styles/tailwind.css';
```

## Add ESLint and Prettier

```shell
ng add @angular-eslint/schematics

npm i -D prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-organize-imports prettier-plugin-tailwindcss
```

Update `.eslintrc.json` file

:::note
Only the lines added are reported here.
:::

```json
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "warn",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  },
  "overrides": [
    {
      "files": ["*.ts"], // <-- existing line
      "extends": ["plugin:prettier/recommended"],
      "rules": {
        "@angular-eslint/no-host-metadata-property": ["off"],
        "prettier/prettier": "warn"
      }
    },
    {
      "files": ["*.html"], // <-- existing line
      "extends": ["plugin:prettier/recommended"],
      "rules": {
        "prettier/prettier": "warn"
      }
    }
  ]
}
```

:::note
The `"@angular-eslint/no-host-metadata-property"` rule is turned off to reflect the latest Angular best pratices.<br />
More info on this [issue](https://github.com/angular/angular/issues/54284).
:::

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

## Using Jest instead of Karma/Jasmine

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

## Add other packages

```shell
npm i @fontsource/nunito canvas-confetti firebase js-cookie @material-symbols/font-600

npm i -D @types/canvas-confetti @types/js-cookie
```
