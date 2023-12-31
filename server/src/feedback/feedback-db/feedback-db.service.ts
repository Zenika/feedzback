import { Injectable } from '@nestjs/common';
import { FieldPath, FieldValue, Filter } from 'firebase-admin/firestore';
import { FirebaseService, docWithId, docsWithId } from '../../core/firebase';
import { Collection, feedbackItemFields } from './feedback-db.config';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback-db.params';
import {
  Feedback,
  FeedbackDraft,
  FeedbackDraftData,
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

  private get feedbackDraftCollection() {
    return this.db.collection(Collection.feedbackDraft);
  }

  constructor(private firebaseService: FirebaseService) {}

  async ping() {
    return !!(await this.feedbackCollection.get());
  }

  async request({ giverEmail, receiverEmail, message, shared }: FeedbackRequestParams) {
    const now = Date.now();
    const request: FeedbackRequest = {
      giverEmail,
      receiverEmail,
      message,
      shared,
      status: FeedbackRequestStatus,
      createdAt: now,
      updatedAt: now,
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

    const { feedbackId, draft } = tokenDoc.data() as FeedbackRequestToken;

    const requestQuery = await this.feedbackCollection
      .where(FieldPath.documentId(), '==', feedbackId)
      .where('status', '==', FeedbackRequestStatus)
      .get();

    const requestDoc = requestQuery.docs.at(0);
    if (!requestDoc) {
      return null;
    }

    return {
      request: docWithId<FeedbackRequestWithId>(requestDoc),
      draft,
    };
  }

  async revealRequestTokenId(feedbackId: string, giverEmail: string) {
    const feedbackDoc = (
      await this.feedbackCollection
        .where(FieldPath.documentId(), '==', feedbackId)
        .where('giverEmail', '==', giverEmail)
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

  async giveRequestedDraft(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    const partialFeedbackRequestToken: Partial<FeedbackRequestToken> = {
      draft: { positive, negative, comment },
    };
    await this.feedbackRequestTokenCollection.doc(tokenId).update(partialFeedbackRequestToken);
  }

  async giveRequested(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    const checked = await this.checkRequest(tokenId);
    if (!checked) {
      return null;
    }

    const feedbackId = checked.request.id;

    const partialFeedback: Partial<Feedback> = {
      positive,
      negative,
      comment,
      status: FeedbackStatus,
      updatedAt: Date.now(),
    };
    await this.feedbackCollection.doc(feedbackId).update(partialFeedback);
    await this.feedbackRequestTokenCollection.doc(tokenId).delete();

    const { giverEmail, receiverEmail, shared } = checked.request;
    return { giverEmail, receiverEmail, shared, feedbackId };
  }

  async giveDraft({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const partialDraft: FeedbackDraft = {
      [receiverEmail]: { receiverEmail, positive, negative, comment, shared },
    };
    await this.feedbackDraftCollection.doc(giverEmail).set(partialDraft, { merge: true });
  }

  async give({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const now = Date.now();
    const feedback: Feedback = {
      giverEmail,
      receiverEmail,
      positive,
      negative,
      comment,
      message: '',
      shared,
      status: FeedbackStatus,
      createdAt: now,
      updatedAt: now,
    };
    const feedbackRef = await this.feedbackCollection.add(feedback);
    const { id } = await feedbackRef.get();

    await this.deleteGiveDraft(giverEmail, receiverEmail);

    return { id } as IdObject;
  }

  private async deleteGiveDraft(giverEmail: string, receiverEmail: string) {
    return await this.feedbackDraftCollection
      .doc(giverEmail)
      .set({ [receiverEmail]: FieldValue.delete() }, { merge: true });
  }

  async getDraftDataList(giverEmail: string) {
    const draftDoc = await this.feedbackDraftCollection.doc(giverEmail).get();
    if (!draftDoc.exists) {
      return [];
    }
    const draft = draftDoc.data() as FeedbackDraft;

    const dataList: FeedbackDraftData[] = Object.values(draft);
    dataList.sort((a, b) => (a.receiverEmail > b.receiverEmail ? 1 : a.receiverEmail < b.receiverEmail ? -1 : 0));

    return dataList;
  }

  async getListMap(viewerEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where(Filter.or(Filter.where('giverEmail', '==', viewerEmail), Filter.where('receiverEmail', '==', viewerEmail)))
      .select(...feedbackItemFields)
      .orderBy('updatedAt' satisfies keyof Feedback, 'desc')
      .get();

    const feedbackList = docsWithId<FeedbackItemWithId | FeedbackRequestItemWithId>(feedbackQuery.docs);

    return mapToFeedbackListMap(feedbackList, viewerEmail);
  }

  async getDocument(viewerEmail: string, id: string): Promise<FeedbackWithId | FeedbackRequestWithId | null> {
    const feedbackQuery = await this.feedbackCollection
      .where(FieldPath.documentId(), '==', id)
      .where(Filter.or(Filter.where('giverEmail', '==', viewerEmail), Filter.where('receiverEmail', '==', viewerEmail)))
      .get();

    const feedbackDoc = feedbackQuery.docs.at(0);
    if (!feedbackDoc) {
      return null;
    }

    return docWithId<FeedbackWithId | FeedbackRequestWithId>(feedbackDoc);
  }

  async getManagedFeedbacks(managedEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where('receiverEmail', '==', managedEmail)
      .where('status', '==', FeedbackStatus)
      .where('shared', '==', true)
      .orderBy('updatedAt' satisfies keyof Feedback, 'desc')
      .get();

    return docsWithId(feedbackQuery.docs) as FeedbackWithId[];
  }
}
