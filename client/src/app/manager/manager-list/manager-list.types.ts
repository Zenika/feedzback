import { Signal } from '@angular/core';
import { FeedbackItem, FeedbackRequestItem } from '../../shared/feedback/feedback.types';

export type ManagerListData = {
  managedEmail: Signal<string>;
  list: Signal<(FeedbackItem | FeedbackRequestItem)[]>;
};
