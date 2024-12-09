import { TemplateRef } from '@angular/core';

export type TimelineItem = {
  content?: string;
  contentTemplate?: TemplateRef<void>;
  iconTemplate?: TemplateRef<void>;
};

export type TimelineLineSize = {
  horizontal?: number;
  vertical?: number;
};

export type TimelineDirection = 'vertical' | 'horizontal';
