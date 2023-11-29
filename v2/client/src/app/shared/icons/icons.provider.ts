import { APP_BASE_HREF } from '@angular/common';
import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgIconNames } from './icons.constants';

export const provideSvgIcons = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, baseHref: string) => async (): Promise<void> => {
    // Set font class according to the NPM package installed: "material-symbols"
    // Values: 'material-symbols-outlined', 'material-symbols-rounded' or 'material-symbols-sharp'.
    // For more infos: https://fonts.google.com/icons
    iconRegistry.setDefaultFontSetClass('material-symbols-rounded');

    // Additional SVG icons
    svgIconNames.forEach((svgIconName) =>
      iconRegistry.addSvgIcon(
        svgIconName,
        sanitizer.bypassSecurityTrustResourceUrl(`${baseHref}assets/svg-icons/${svgIconName}.svg`),
      ),
    );
    return Promise.resolve();
  },
  deps: [MatIconRegistry, DomSanitizer, APP_BASE_HREF],
  multi: true,
});
