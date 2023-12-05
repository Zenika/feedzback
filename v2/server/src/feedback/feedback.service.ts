import { Injectable } from '@nestjs/common';
import { FieldPath, Filter } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { AskFeedbackParams, SendAskedFeedbackParams, SendFeedbackParams } from './feedback.params';
import { AskedFeedback, AskedFeedbackWithId, Feedback, FeedbackIdObj, FeedbackWithId } from './feedback.types';
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
      await this.firebaseService.firestore.collection('feedback').add(askedFeedback);
      return true;
    } catch {
      return false;
    }
  }

  async checkAsked(id: string) {
    try {
      const query = await this.firebaseService.firestore
        .collection('feedback')
        .where(FieldPath.documentId(), '==', id)
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

  async sendAsked(id: string, { positive, negative, comment }: SendAskedFeedbackParams) {
    try {
      const askedFeedback = await this.checkAsked(id);
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
      await this.firebaseService.firestore.collection('feedback').doc(id).update(partialFeedback);
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