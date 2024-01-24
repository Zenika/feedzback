import { Injectable } from '@nestjs/common';
import { FieldPath, Filter } from 'firebase-admin/firestore';
import { CryptoService } from '../../core/crypto/crypto.service';
import { FirebaseService, docWithId, docsWithId, sortList } from '../../core/firebase';
import { Collection, feedbackItemFields } from './feedback-db.config';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback-db.params';
import {
  Feedback,
  FeedbackDraftType,
  FeedbackEncryptedFields,
  FeedbackItemWithId,
  FeedbackRequest,
  FeedbackRequestItemWithId,
  FeedbackRequestStatus,
  FeedbackRequestToken,
  FeedbackRequestWithId,
  FeedbackRequestedDraft,
  FeedbackRequestedDraftType,
  FeedbackSpontaneousDraft,
  FeedbackSpontaneousDraftType,
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

  private get feedbackDraftMapsCollection() {
    return this.firebaseService.db.collection(Collection.feedbackDraft);
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

    const { feedbackId } = tokenDoc.data() as FeedbackRequestToken;

    const requestQuery = await this.feedbackCollection
      .where(FieldPath.documentId(), '==', feedbackId)
      .where('status', '==', FeedbackRequestStatus)
      .get();

    const requestDoc = requestQuery.docs.at(0);
    if (!requestDoc) {
      return null;
    }

    return docWithId<FeedbackRequestWithId>(requestDoc);
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
    const request = await this.checkRequest(tokenId);
    if (!request) {
      return null;
    }

    const feedbackRequestedDraft = this.encryptFeedback<FeedbackRequestedDraft>({
      token: tokenId,
      receiverEmail: request.receiverEmail,
      positive,
      negative,
      comment,
    });
    await this.feedbackDraftMapsCollection
      .doc(request.giverEmail)
      .collection(FeedbackRequestedDraftType)
      .doc(tokenId)
      .set(feedbackRequestedDraft, { merge: true });
  }

  async giveRequested(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    const request = await this.checkRequest(tokenId);
    if (!request) {
      return null;
    }

    const feedbackId = request.id;
    const partialFeedback: Partial<Feedback> = this.encryptFeedback({
      positive,
      negative,
      comment,
      status: FeedbackStatus,
      updatedAt: Date.now(),
    });
    await this.feedbackCollection.doc(feedbackId).update(partialFeedback);

    await this.feedbackRequestTokenCollection.doc(tokenId).delete();
    await this.deleteDraft(request.giverEmail, FeedbackRequestedDraftType, tokenId);

    const { giverEmail, receiverEmail, shared } = request;
    return { giverEmail, receiverEmail, shared, feedbackId };
  }

  // ----- Give spontaneous feedback -----

  async giveDraft({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const feedbackSpontaneousDraft = this.encryptFeedback<FeedbackSpontaneousDraft>({
      receiverEmail,
      positive,
      negative,
      comment,
      shared,
    });
    await this.feedbackDraftMapsCollection
      .doc(giverEmail)
      .collection(FeedbackSpontaneousDraftType)
      .doc(receiverEmail)
      .set(feedbackSpontaneousDraft, { merge: true });
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

    await this.deleteDraft(giverEmail, FeedbackSpontaneousDraftType, receiverEmail);

    return { id } as IdObject;
  }

  // ----- Manage feedback draft -----

  async deleteDraft(giverEmail: string, type: FeedbackDraftType, receiverEmailOrToken: string) {
    await this.feedbackDraftMapsCollection.doc(giverEmail).collection(type).doc(receiverEmailOrToken).delete();
  }

  async getSpontaneousDraft(giverEmail: string, receiverEmail: string) {
    const draftDoc = await this.feedbackDraftMapsCollection
      .doc(giverEmail)
      .collection(FeedbackSpontaneousDraftType)
      .doc(receiverEmail)
      .get();
    if (!draftDoc.exists) {
      return undefined;
    }
    return this.decryptFeedback(draftDoc.data() as FeedbackSpontaneousDraft);
  }

  async getRequestedDraft(giverEmail: string, token: string) {
    const draftDoc = await this.feedbackDraftMapsCollection
      .doc(giverEmail)
      .collection(FeedbackRequestedDraftType)
      .doc(token)
      .get();
    if (!draftDoc.exists) {
      return undefined;
    }
    return this.decryptFeedback(draftDoc.data() as FeedbackRequestedDraft);
  }

  async getDraftListMap(giverEmail: string) {
    const spontaneousQuery = await this.feedbackDraftMapsCollection
      .doc(giverEmail)
      .collection(FeedbackSpontaneousDraftType)
      .get();

    const requestedQuery = await this.feedbackDraftMapsCollection
      .doc(giverEmail)
      .collection(FeedbackRequestedDraftType)
      .get();

    return {
      spontaneous: sortList(
        spontaneousQuery.docs.map((doc) => this.decryptFeedback(doc.data() as FeedbackSpontaneousDraft)),
        'receiverEmail',
      ),
      requested: sortList(
        requestedQuery.docs.map((doc) => this.decryptFeedback(doc.data() as FeedbackRequestedDraft)),
        'receiverEmail',
      ),
    };
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
