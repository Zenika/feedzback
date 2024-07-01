import { InputSignal, TemplateRef } from '@angular/core';

export type DialogTooltipData = {
  title: InputSignal<string | undefined>;
  content: InputSignal<string | TemplateRef<unknown>>;
};
