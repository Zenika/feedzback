import { FooterComponent } from '../../footer/footer.component';
import { BurgerComponent } from '../../header/burger/burger.component';
import { HeaderComponent } from '../../header/header.component';
import { LayoutComponent } from './layout.component';
import { LayoutFooterDirective, LayoutHeaderDirective, LayoutMainDirective } from './layout.directive';

export const LayoutModule = [
  FooterComponent,
  BurgerComponent,
  HeaderComponent,
  LayoutComponent,
  LayoutFooterDirective,
  LayoutHeaderDirective,
  LayoutMainDirective,
] as const;
