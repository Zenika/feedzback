import { Injectable } from '@nestjs/common';
import { FieldPath, Filter } from 'firebase-admin/firestore';
import { FirebaseService } from '../../core/firebase';
import { Collection, feedbackItemFields } from './feedback-db.config';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback-db.params';
import {
  Feedback,
  FeedbackItemWithId,
  FeedbackRequest,
  FeedbackRequestItemWithId,
  FeedbackRequestStatus,
  FeedbackRequestToken,
  FeedbackRequestWithId,
  FeedbackStatus,
  FeedbackWithId,
  IdObject,
} from './feedback-db.types';
import { mapToFeedbackListMap } from './feedback-db.utils';

@Injectable()
export class FeedbackDbService {
  private db = this.firebaseService.db;

  private get feedbackCollection() {
    return this.db.collection(Collection.feedback);
  }

  private get feedbackRequestTokenCollection() {
    return this.db.collection(Collection.feedbackRequestToken);
  }

  constructor(private firebaseService: FirebaseService) {}

  async ping() {
    return !!(await this.feedbackCollection.get());
  }

  async request({ senderEmail, receiverEmail, message, shared }: FeedbackRequestParams) {
    const request: FeedbackRequest = {
      senderEmail,
      receiverEmail,
      message,
      shared,
      status: FeedbackRequestStatus,
      createdAt: Date.now(),
    };
    const feedbackId = (await this.feedbackCollection.add(request)).id;

    const token: FeedbackRequestToken = {
      feedbackId,
    };
    const tokenId = (await this.feedbackRequestTokenCollection.add(token)).id;

    return tokenId;
  }

  async checkRequest(tokenId: string) {
    const tokenDoc = await this.feedbackRequestTokenCollection.doc(tokenId).get();
    if (!tokenDoc.exists) {
      return null;
    }

    const { feedbackId } = tokenDoc.data() as FeedbackRequestToken;

    const requestQuery = await this.feedbackCollection
      .where(FieldPath.documentId(), '==', feedbackId)
      .where('status', '==', FeedbackRequestStatus)
      .get();

    const requestDoc = requestQuery.docs.at(0);
    if (!requestDoc) {
      return null;
    }

    return { id: requestDoc.id, ...requestDoc.data() } as FeedbackRequestWithId;
  }

  async revealRequestTokenId(feedbackId: string, senderEmail: string) {
    const feedbackDoc = (
      await this.feedbackCollection
        .where(FieldPath.documentId(), '==', feedbackId)
        .where('senderEmail', '==', senderEmail)
        .where('status', '==', FeedbackRequestStatus)
        .get()
    ).docs.at(0);
    if (!feedbackDoc) {
      return null;
    }

    const tokenDoc = (await this.feedbackRequestTokenCollection.where('feedbackId', '==', feedbackId).get()).docs.at(0);
    if (!tokenDoc) {
      return null;
    }

    return tokenDoc.id;
  }

  async giveRequested(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    const request = await this.checkRequest(tokenId);
    if (!request) {
      return null;
    }

    const partialFeedback: Partial<Feedback> = {
      positive,
      negative,
      comment,
      status: FeedbackStatus,
      updatedAt: Date.now(),
    };
    await this.feedbackCollection.doc(request.id).update(partialFeedback);
    await this.feedbackRequestTokenCollection.doc(tokenId).delete();

    const { senderEmail, receiverEmail, id: feedbackId } = request;
    return { senderEmail, receiverEmail, feedbackId };
  }

  async give({ senderEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
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
    const feedbackRef = await this.feedbackCollection.add(feedback);
    const { id } = await feedbackRef.get();
    return { id } as IdObject;
  }

  async getListMap(viewerEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where(
        Filter.or(Filter.where('senderEmail', '==', viewerEmail), Filter.where('receiverEmail', '==', viewerEmail)),
      )
      .select(...feedbackItemFields)
      .get();

    const feedbackList = feedbackQuery.docs.map(
      (feedback) => ({ id: feedback.id, ...feedback.data() }) as FeedbackItemWithId | FeedbackRequestItemWithId,
    );

    return mapToFeedbackListMap(feedbackList, viewerEmail);
  }

  async getItem(viewerEmail: string, id: string): Promise<FeedbackWithId | FeedbackRequestWithId | null> {
    const feedbackQuery = await this.feedbackCollection
      .where(FieldPath.documentId(), '==', id)
      .where(
        Filter.or(Filter.where('senderEmail', '==', viewerEmail), Filter.where('receiverEmail', '==', viewerEmail)),
      )
      .get();

    const feedbackDoc = feedbackQuery.docs.at(0);
    if (!feedbackDoc) {
      return null;
    }

    return { id: feedbackDoc.id, ...feedbackDoc.data() } as FeedbackWithId | FeedbackRequestWithId;
  }

  async getManagedFeedbacks(managedEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where('receiverEmail', '==', managedEmail)
      .where('status', '==', FeedbackStatus)
      .where('shared', '==', true)
      .get();
    return feedbackQuery.docs.map((feedback) => ({ id: feedback.id, ...feedback.data() }) as FeedbackWithId);
  }
}
