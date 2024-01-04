import { Injectable } from '@nestjs/common';
import { FieldPath, FieldValue, Filter } from 'firebase-admin/firestore';
import { FirebaseService, docWithId, docsWithId, sortList } from '../../core/firebase';
import { Collection, feedbackItemFields } from './feedback-db.config';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback-db.params';
import {
  Feedback,
  FeedbackDraft,
  FeedbackDraftMap,
  FeedbackItemWithId,
  FeedbackRequest,
  FeedbackRequestItemWithId,
  FeedbackRequestStatus,
  FeedbackRequestToken,
  FeedbackRequestWithId,
  FeedbackStatus,
  FeedbackWithId,
  IdObject,
  TokenObject,
} from './feedback-db.types';
import { mapToFeedbackListMap } from './feedback-db.utils';

@Injectable()
export class FeedbackDbService {
  private get feedbackCollection() {
    return this.firebaseService.db.collection(Collection.feedback);
  }

  private get feedbackRequestTokenCollection() {
    return this.firebaseService.db.collection(Collection.feedbackRequestToken);
  }

  private get feedbackDraftMapCollection() {
    return this.firebaseService.db.collection(Collection.feedbackDraftMap);
  }

  constructor(private firebaseService: FirebaseService) {}

  async ping() {
    return !!(await this.feedbackCollection.get());
  }

  // ----- Request feedback and give requested feedback -----

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

  async requestAgain(feedbackId: string, receiverEmail: string) {
    const requestDoc = await this.feedbackCollection.doc(feedbackId).get();
    if (!requestDoc.exists) {
      return null;
    }
    const request = requestDoc.data() as FeedbackRequest;

    if (request.receiverEmail !== receiverEmail) {
      return null;
    }

    const tokenId = await this.revealRequestTokenId(feedbackId, request.giverEmail);
    if (!tokenId) {
      return null;
    }

    const partialFeedbackRequest: Partial<FeedbackRequest> = {
      updatedAt: Date.now(),
    };
    await this.feedbackCollection.doc(feedbackId).update(partialFeedbackRequest);

    return { ...request, token: tokenId } satisfies FeedbackRequest & TokenObject;
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

  // ----- Give spontaneous feedback -----

  async giveDraft({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const partialDraftMap: FeedbackDraftMap = {
      [receiverEmail]: { receiverEmail, positive, negative, comment, shared },
    };
    await this.feedbackDraftMapCollection.doc(giverEmail).set(partialDraftMap, { merge: true });
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

    await this.deleteDraft(giverEmail, receiverEmail);

    return { id } as IdObject;
  }

  async deleteDraft(giverEmail: string, receiverEmail: string) {
    await this.feedbackDraftMapCollection
      .doc(giverEmail)
      .set({ [receiverEmail]: FieldValue.delete() }, { merge: true });
  }

  async getDraftList(giverEmail: string) {
    const draftMapDoc = await this.feedbackDraftMapCollection.doc(giverEmail).get();
    if (!draftMapDoc.exists) {
      return [];
    }
    const draftMap = draftMapDoc.data() as FeedbackDraftMap;

    const draftList: FeedbackDraft[] = Object.values(draftMap);
    return sortList(draftList, 'receiverEmail');
  }

  // ----- View feedbacks (requested and given) -----

  async getListMap(viewerEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where('status', '==', FeedbackStatus)
      .where(Filter.or(Filter.where('giverEmail', '==', viewerEmail), Filter.where('receiverEmail', '==', viewerEmail)))
      .select(...feedbackItemFields)
      .orderBy('updatedAt' satisfies keyof Feedback, 'desc')
      .get();

    const feedbackRequestQuery = await this.feedbackCollection
      .where('status', '==', FeedbackRequestStatus)
      .where(Filter.or(Filter.where('giverEmail', '==', viewerEmail), Filter.where('receiverEmail', '==', viewerEmail)))
      .select(...feedbackItemFields)
      .orderBy('createdAt' satisfies keyof Feedback, 'desc')
      .get();

    return mapToFeedbackListMap(
      [
        ...docsWithId<FeedbackItemWithId>(feedbackQuery.docs),
        ...docsWithId<FeedbackRequestItemWithId>(feedbackRequestQuery.docs),
      ],
      viewerEmail,
    );
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
