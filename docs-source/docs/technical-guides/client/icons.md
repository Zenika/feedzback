# Icons

## Material icons

The Material component `<mat-icon>` is configured to use the icons from the NPM package `@material-symbols/font-600`.

For more details, see the file [`src/app/shared/icon/icon.provider.ts`](https://github.com/Zenika/feedzback/blob/main/client/src/app/shared/icon/icon.provider.ts).

## IconDirective

The Material icon component `<mat-icon>` has some limitations when it comes to resizing icons.
Use the `IconDirective` directive to overcome this problem.

```ts
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from './shared/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule, IconDirective],
  template: `
    <h1>
      <mat-icon appIcon size="xl" pull="left" animation="beat">home</mat-icon>
      Home
    </h1>
  `,
})
export class AppComponent {}
```
