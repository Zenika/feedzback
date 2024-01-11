import { Injectable } from '@nestjs/common';
import { FieldPath, FieldValue, Filter } from 'firebase-admin/firestore';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { FirebaseService, docWithId, docsWithId, sortList } from '../../core/firebase';
import { Collection, feedbackItemFields } from './feedback-db.config';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback-db.params';
import {
  Feedback,
  FeedbackDraft,
  FeedbackDraftMap,
  FeedbackEncryptedFields,
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
  feedbackEncryptedFields,
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

  constructor(
    private firebaseService: FirebaseService,
    private cryptoService: CryptoService,
  ) {}

  async ping() {
    return !!(await this.feedbackCollection.get());
  }

  // ----- Request feedback and give requested feedback -----

  async request({ giverEmail, receiverEmail, message, shared }: FeedbackRequestParams) {
    const now = Date.now();
    const request: FeedbackRequest = this.encryptFeedback({
      giverEmail,
      receiverEmail,
      message,
      shared,
      status: FeedbackRequestStatus,
      createdAt: now,
      updatedAt: now,
    });
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

    return { ...this.decryptFeedback(request), token: tokenId } satisfies FeedbackRequest & TokenObject;
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
      draft: draft ? this.decryptFeedback(draft) : undefined,
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
      draft: this.encryptFeedback({ positive, negative, comment }),
    };
    await this.feedbackRequestTokenCollection.doc(tokenId).update(partialFeedbackRequestToken);
  }

  async giveRequested(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    const checked = await this.checkRequest(tokenId);
    if (!checked) {
      return null;
    }

    const feedbackId = checked.request.id;

    const partialFeedback: Partial<Feedback> = this.encryptFeedback({
      positive,
      negative,
      comment,
      status: FeedbackStatus,
      updatedAt: Date.now(),
    });
    await this.feedbackCollection.doc(feedbackId).update(partialFeedback);
    await this.feedbackRequestTokenCollection.doc(tokenId).delete();

    const { giverEmail, receiverEmail, shared } = checked.request;
    return { giverEmail, receiverEmail, shared, feedbackId };
  }

  // ----- Give spontaneous feedback -----

  async giveDraft({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const partialDraftMap: FeedbackDraftMap = {
      [receiverEmail]: this.encryptFeedback<FeedbackDraft>({ receiverEmail, positive, negative, comment, shared }),
    };
    await this.feedbackDraftMapCollection.doc(giverEmail).set(partialDraftMap, { merge: true });
  }

  async give({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const now = Date.now();
    const feedback: Feedback = this.encryptFeedback({
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
    });
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

    const draftList: FeedbackDraft[] = Object.values(draftMap).map(this.decryptFeedback.bind(this));
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

    return this.decryptFeedback(docWithId<FeedbackWithId | FeedbackRequestWithId>(feedbackDoc));
  }

  async getManagedFeedbacks(managedEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where('receiverEmail', '==', managedEmail)
      .where('status', '==', FeedbackStatus)
      .where('shared', '==', true)
      .orderBy('updatedAt' satisfies keyof Feedback, 'desc')
      .get();

    return (docsWithId(feedbackQuery.docs) as FeedbackWithId[]).map(this.decryptFeedback.bind(this));
  }

  // ----- Encrypt and decrypt feedback -----

  private encryptFeedback<T extends Partial<Feedback> | Partial<FeedbackRequest>>(data: T): T {
    return this.runEncryption('encrypt', data);
  }

  private decryptFeedback<T extends Partial<Feedback> | Partial<FeedbackRequest>>(data: T): T {
    return this.runEncryption('decrypt', data);
  }

  private runEncryption<T extends Partial<FeedbackEncryptedFields>>(operation: 'encrypt' | 'decrypt', input: T): T {
    const output: T = { ...input };
    feedbackEncryptedFields.forEach((field) => {
      if (!output[field]) {
        return;
      }
      output[field] = this.cryptoService[operation](output[field]!);
    });
    return output;
  }
}
