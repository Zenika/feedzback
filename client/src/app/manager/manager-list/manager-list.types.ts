import { Signal } from '@angular/core';
import { FeedbackItem, FeedbackRequestItem } from '../../shared/feedback/feedback.types';

export interface ManagerListData {
  managedEmail: Signal<string>;
  list: Signal<(FeedbackItem | FeedbackRequestItem)[]>;
}
