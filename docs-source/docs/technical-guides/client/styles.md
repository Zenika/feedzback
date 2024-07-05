# Styles

## Global styles

The entry point of the global styles is as usual for an Angular application: [client/src/styles.scss](https://github.com/Zenika/feedzback/blob/main/client/src/styles.scss)

```scss
// ----- Base -----

@import './styles/fonts';
@import './styles/tailwind.css';
@import './styles/material';
@import './styles/base';

// ----- Special `.gbl-*` styles -----

@import './styles/common';
@import './styles/info';
@import './styles/landing';
@import './styles/forms';
```

All special global styles starts with `.gbl-*` prefix.

## Component styles

All component styles starts with `.app-*` prefix.

Component styles are encapsulated manually following the [BEM](https://getbem.com/introduction/) convention (**B**lock-**E**lement-**M**odifier).

Here's an example with the header component:

```ts title="client/src/app/header/header.component.ts"
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header',
  host: { class: 'app-header' }, // Component root css class
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None, // No framework encapsulation
})
export class HeaderComponent {}
```

This is what the final markup looks like when rendered in the browser:

```html
<!-- Block -->
<app-header class="app-header">
  <!-- Element -->
  <div class="app-header__logo">...</div>
  <!-- Element and Modifier -->
  <nav class="app-header__menu app-header__menu--visible">...</nav>
  ...
</app-header>
```

And the Sass styles should looks like this:

```scss title="client/src/app/header/header.component.scss"
@use '../app.scss' as app;

.app-header {
  &__logo {
    // ...
  }
  &__menu {
    // ...
    &--visible {
      // ...
    }
  }
}
```

:::note
The [`src/app/app.scss`](https://github.com/Zenika/feedzback/blob/main/client/src/app/app.scss) file gives you access to the global Sass variables and mixins in the component styles.
:::

## Material

Material design is enabled for the entire HTML page using the `.mat-typography` css class on the body tag:

```html title="client/src/index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>FeedZback</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  </head>
  <body class="mat-typography">
    <app-root></app-root>
  </body>
</html>
```

Only the styles of the Material components that are used in the application are included.
See [here](https://github.com/Zenika/feedzback/blob/main/client/src/styles/material/index.scss) for more infos.

## Tailwindcss

Tailwind is only used in Angular component templates for utility classes like: `ms-4`, `me-4`, `mb-4`, `flex`, `items-center`, `justify-center`, ...
The main styles are written in Angular component styles following the **BEM** convention.

Currently, Tailwind "Preflight" breaks some Angular material components.
It also conflicts with the global `.mat-typography`.
Therefore it has been disabled:

```ts title="client/tailwind.config.ts"
import type { Config } from 'tailwindcss';

export default {
  corePlugins: {
    // Warning: Tailwind "Preflight" breaks some Angular material components
    //
    // Learn more about this issue and a hack to solve it:
    //    https://github.com/tailwindlabs/tailwindcss/discussions/9993
    preflight: false,
  },
} satisfies Config;
```
