import { APP_BASE_HREF } from '@angular/common';
import { inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgIconNames } from './icon.constants';

export const provideSvgIcons = () =>
  provideAppInitializer(() => {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    const baseHref = inject(APP_BASE_HREF);

    // Set font class according to the NPM package installed: "@material-symbols/font-*"
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
  });
