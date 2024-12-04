export * from './negative-feedback-guide/negative-feedback-guide.component';
export * from './positive-feedback-guide/positive-feedback-guide.component';

import { NegativeFeedbackGuideComponent } from './negative-feedback-guide/negative-feedback-guide.component';
import { PositiveFeedbackGuideComponent } from './positive-feedback-guide/positive-feedback-guide.component';

export const FeedbackGuideModule = [NegativeFeedbackGuideComponent, PositiveFeedbackGuideComponent] as const;
