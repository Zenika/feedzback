import { LayoutComponent } from './layout.component';
import { LayoutFooterDirective, LayoutHeaderDirective, LayoutMainDirective } from './layout.directive';

export const LayoutModule = [
  LayoutComponent,
  LayoutFooterDirective,
  LayoutHeaderDirective,
  LayoutMainDirective,
] as const;
