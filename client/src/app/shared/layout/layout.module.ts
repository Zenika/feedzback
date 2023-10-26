import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {LayoutFooterDirective, LayoutHeaderDirective, LayoutMainDirective} from './layout.directive';

const features = [LayoutComponent, LayoutHeaderDirective, LayoutMainDirective, LayoutFooterDirective];

@NgModule({
  imports: [CommonModule],
  declarations: features,
  exports: features,
})
export class LayoutModule {}
