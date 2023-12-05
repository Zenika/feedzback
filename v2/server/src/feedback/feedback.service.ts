import { Injectable } from '@nestjs/common';
import { FieldPath, Filter } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { AskFeedbackParams, SendAskedFeedbackParams, SendFeedbackParams } from './feedback.params';
import {
  AskedFeedback,
  AskedFeedbackToken,
  AskedFeedbackWithId,
  Feedback,
  FeedbackIdObj,
  FeedbackWithId,
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

  async ask({ senderEmail, receiverEmail, message, shared }: AskFeedbackParams) {
    try {
      const askedFeedback: AskedFeedback = {
        senderEmail,
        receiverEmail,
        message,
        shared,
        status: 'asked',
        createdAt: Date.now(),
      };
      const feedbackId = (await this.firebaseService.firestore.collection('feedback').add(askedFeedback)).id;

      const askedFeedbackToken: AskedFeedbackToken = {
        feedbackId,
      };
      const tokenId = (await this.firebaseService.firestore.collection('askedFeedbackToken').add(askedFeedbackToken))
        .id;

      return tokenId;
    } catch {
      return null;
    }
  }

  async checkAsked(tokenId: string) {
    try {
      const tokenDoc = await this.firebaseService.firestore.collection('askedFeedbackToken').doc(tokenId).get();

      if (!tokenDoc.exists) {
        throw new Error();
      }
      const { feedbackId } = tokenDoc.data() as AskedFeedbackToken;

      const query = await this.firebaseService.firestore
        .collection('feedback')
        .where(FieldPath.documentId(), '==', feedbackId)
        .where('status', '==', 'asked')
        .get();

      const doc = query.docs.at(0);
      if (!doc) {
        throw new Error();
      }

      return { id: doc.id, ...doc.data() } as AskedFeedbackWithId;
    } catch {
      return null;
    }
  }

  async revealTokenId(senderEmail: string, feedbackId: string) {
    try {
      const feedbackDoc = (
        await this.firebaseService.firestore
          .collection('feedback')
          .where(FieldPath.documentId(), '==', feedbackId)
          .where('senderEmail', '==', senderEmail)
          .where('status', '==', 'asked')
          .get()
      ).docs.at(0);

      if (!feedbackDoc) {
        throw new Error();
      }

      const tokenDoc = (
        await this.firebaseService.firestore
          .collection('askedFeedbackToken')
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

  async sendAsked(tokenId: string, { positive, negative, comment }: SendAskedFeedbackParams) {
    try {
      const askedFeedback = await this.checkAsked(tokenId);
      if (!askedFeedback) {
        return false;
      }
      const partialFeedback: Partial<Feedback> = {
        positive,
        negative,
        comment,
        status: 'given',
        updatedAt: Date.now(),
      };
      await this.firebaseService.firestore.collection('feedback').doc(askedFeedback.id).update(partialFeedback);
      await this.firebaseService.firestore.collection('askedFeedbackToken').doc(tokenId).delete();
      return true;
    } catch {
      return false;
    }
  }

  async send({
    senderEmail,
    receiverEmail,
    positive,
    negative,
    comment,
    shared,
  }: SendFeedbackParams): Promise<Partial<FeedbackIdObj>> {
    try {
      const feedback: Feedback = {
        senderEmail,
        receiverEmail,
        positive,
        negative,
        comment,
        message: '',
        shared,
        status: 'given',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const docRef = await this.firebaseService.firestore.collection('feedback').add(feedback);
      const { id } = await docRef.get();
      return { id } as FeedbackIdObj;
    } catch {
      return { id: undefined };
    }
  }

  async getList(userEmail: string) {
    try {
      const query = await this.firebaseService.firestore
        .collection('feedback')
        .where(Filter.or(Filter.where('senderEmail', '==', userEmail), Filter.where('receiverEmail', '==', userEmail)))
        .get();

      const feedbacks = query.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as FeedbackWithId | AskedFeedbackWithId,
      );

      return mapToTypedFeedbacks(feedbacks, userEmail);
    } catch {
      return mapToTypedFeedbacks([], '');
    }
  }

  async getItem(userEmail: string, id: string): Promise<FeedbackWithId | AskedFeedbackWithId | null> {
    try {
      const query = await this.firebaseService.firestore
        .collection('feedback')
        .where(FieldPath.documentId(), '==', id)
        .where(Filter.or(Filter.where('senderEmail', '==', userEmail), Filter.where('receiverEmail', '==', userEmail)))
        .get();

      const doc = query.docs.at(0);
      if (!doc) {
        throw new Error();
      }

      return { id: doc.id, ...doc.data() } as FeedbackWithId | AskedFeedbackWithId;
    } catch {
      return null;
    }
  }
}
