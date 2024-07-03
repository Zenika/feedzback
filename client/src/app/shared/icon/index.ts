import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from './icon.directive';

export * from './icon.directive';
export * from './icon.provider';
export * from './icon.types';

// Make easier the import of `MatIconModule` alongside `IconDirective`
export const IconModule = [MatIconModule, IconDirective] as const;
