import { Directive } from '@angular/core';
import { FeedbackType } from '../feedback-details/feedback-details.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export type MyFeedbacksTemplateContext = {
  $implicit: NormalizedFeedback[];
  type: FeedbackType;
};

@Directive({
  selector: '[appMyFeedbacksTemplateContext]',
  standalone: true,
})
export class MyFeedbacksTemplateContextDirective {
  static ngTemplateContextGuard(dir: unknown, ctx: unknown): ctx is MyFeedbacksTemplateContext {
    return true;
  }
}
