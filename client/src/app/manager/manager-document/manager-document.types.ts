import { Signal } from '@angular/core';
import { Feedback, FeedbackRequest } from '../../shared/feedback/feedback.types';

export type ManagerDocumentData = {
  document: Signal<Feedback | FeedbackRequest>;
};
