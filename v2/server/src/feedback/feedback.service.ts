import { Injectable } from '@nestjs/common';
import { FieldPath, Filter } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback.params';
import {
  Feedback,
  FeedbackRequest,
  FeedbackRequestStatus,
  FeedbackRequestToken,
  FeedbackRequestWithId,
  FeedbackStatus,
  FeedbackWithId,
  IdObject,
} from './feedback.types';
import { mapToTypedFeedbacks } from './feedback.utils';

@Injectable()
export class FeedbackService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async ping() {
    try {
      return !!(await this.firebaseService.firestore.collection('feedback').get());
    } catch {
      return false;
    }
  }

  async request({ senderEmail, receiverEmail, message, shared }: FeedbackRequestParams) {
    try {
      const request: FeedbackRequest = {
        senderEmail,
        receiverEmail,
        message,
        shared,
        status: FeedbackRequestStatus,
        createdAt: Date.now(),
      };
      const feedbackId = (await this.firebaseService.firestore.collection('feedback').add(request)).id;

      const token: FeedbackRequestToken = {
        feedbackId,
      };
      const tokenId = (await this.firebaseService.firestore.collection('feedbackRequestToken').add(token)).id;

      return tokenId;
    } catch {
      return null;
    }
  }

  async checkRequest(tokenId: string) {
    try {
      const tokenDoc = await this.firebaseService.firestore.collection('feedbackRequestToken').doc(tokenId).get();

      if (!tokenDoc.exists) {
        throw new Error();
      }
      const { feedbackId } = tokenDoc.data() as FeedbackRequestToken;

      const requestQuery = await this.firebaseService.firestore
        .collection('feedback')
        .where(FieldPath.documentId(), '==', feedbackId)
        .where('status', '==', FeedbackRequestStatus)
        .get();

      const requestDoc = requestQuery.docs.at(0);
      if (!requestDoc) {
        throw new Error();
      }

      return { id: requestDoc.id, ...requestDoc.data() } as FeedbackRequestWithId;
    } catch {
      return null;
    }
  }

  async revealRequestTokenId(feedbackId: string, senderEmail: string) {
    try {
      const feedbackDoc = (
        await this.firebaseService.firestore
          .collection('feedback')
          .where(FieldPath.documentId(), '==', feedbackId)
          .where('senderEmail', '==', senderEmail)
          .where('status', '==', FeedbackRequestStatus)
          .get()
      ).docs.at(0);

      if (!feedbackDoc) {
        throw new Error();
      }

      const tokenDoc = (
        await this.firebaseService.firestore
          .collection('feedbackRequestToken')
          .where('feedbackId', '==', feedbackId)
          .get()
      ).docs.at(0);

      if (!tokenDoc) {
        throw new Error();
      }

      return tokenDoc.id;
    } catch {
      return null;
    }
  }

  async giveRequested(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    try {
      const request = await this.checkRequest(tokenId);
      if (!request) {
        return false;
      }
      const partialFeedback: Partial<Feedback> = {
        positive,
        negative,
        comment,
        status: FeedbackStatus,
        updatedAt: Date.now(),
      };
      await this.firebaseService.firestore.collection('feedback').doc(request.id).update(partialFeedback);
      await this.firebaseService.firestore.collection('feedbackRequestToken').doc(tokenId).delete();
      return true;
    } catch {
      return false;
    }
  }

  async give({
    senderEmail,
    receiverEmail,
    positive,
    negative,
    comment,
    shared,
  }: GiveFeedbackParams): Promise<Partial<IdObject>> {
    try {
      const feedback: Feedback = {
        senderEmail,
        receiverEmail,
        positive,
        negative,
        comment,
        message: '',
        shared,
        status: FeedbackStatus,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const feedbackRef = await this.firebaseService.firestore.collection('feedback').add(feedback);
      const { id } = await feedbackRef.get();
      return { id } as IdObject;
    } catch {
      return { id: undefined } as Partial<IdObject>;
    }
  }

  async getList(userEmail: string) {
    try {
      const feedbackQuery = await this.firebaseService.firestore
        .collection('feedback')
        .where(Filter.or(Filter.where('senderEmail', '==', userEmail), Filter.where('receiverEmail', '==', userEmail)))
        .get();

      const feedbacks = feedbackQuery.docs.map(
        (feedback) => ({ id: feedback.id, ...feedback.data() }) as FeedbackWithId | FeedbackRequestWithId,
      );

      return mapToTypedFeedbacks(feedbacks, userEmail);
    } catch {
      return mapToTypedFeedbacks([], '');
    }
  }

  async getItem(userEmail: string, id: string): Promise<FeedbackWithId | FeedbackRequestWithId | null> {
    try {
      const feedbackQuery = await this.firebaseService.firestore
        .collection('feedback')
        .where(FieldPath.documentId(), '==', id)
        .where(Filter.or(Filter.where('senderEmail', '==', userEmail), Filter.where('receiverEmail', '==', userEmail)))
        .get();

      const feedbackDoc = feedbackQuery.docs.at(0);
      if (!feedbackDoc) {
        throw new Error();
      }

      return { id: feedbackDoc.id, ...feedbackDoc.data() } as FeedbackWithId | FeedbackRequestWithId;
    } catch {
      return null;
    }
  }
}
