import { Directive } from '@angular/core';

@Directive({ selector: '[appLayoutHeader]', standalone: true })
export class LayoutHeaderDirective {}

@Directive({ selector: '[appLayoutMain]', standalone: true })
export class LayoutMainDirective {}

@Directive({ selector: '[appLayoutFooter]', standalone: true })
export class LayoutFooterDirective {}
