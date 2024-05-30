import { Signal } from '@angular/core';
import { Feedback, FeedbackRequest } from '../../shared/feedback/feedback.types';

export interface ManagerDocumentData {
  document: Signal<Feedback | FeedbackRequest>;
}
