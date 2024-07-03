import { Directive } from '@angular/core';

@Directive({ selector: '[appSlashSuper]', standalone: true })
export class SlashSuperDirective {}

@Directive({ selector: '[appSlashSub]', standalone: true })
export class SlashSubDirective {}
