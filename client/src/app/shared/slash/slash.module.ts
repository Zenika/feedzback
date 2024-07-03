import { SlashComponent } from './slash.component';
import { SlashSubDirective, SlashSuperDirective } from './slash.directives';

export const SlashModule = [SlashComponent, SlashSubDirective, SlashSuperDirective] as const;
