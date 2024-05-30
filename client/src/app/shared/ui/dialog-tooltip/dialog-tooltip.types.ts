import { InputSignal, TemplateRef } from '@angular/core';

export interface DialogTooltipData {
  title: InputSignal<string | undefined>;
  content: InputSignal<string | TemplateRef<unknown>>;
}
