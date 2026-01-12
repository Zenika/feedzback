import { Injectable } from '@nestjs/common';
import { FieldPath } from 'firebase-admin/firestore';
import { CryptoService } from '../../core/crypto/crypto.service';
import { FirebaseService, docWithId, docsWithId, sortList } from '../../core/firebase';
import { FEEDBACK_PRE_REQUEST_MAX_USES } from '../feedback.config';
import { Collection, feedbackItemFields } from './feedback-db.config';
import {
  FeedbackPreRequestTokenParams,
  FeedbackRequestParams,
  GiveFeedbackParams,
  GiveRequestedFeedbackParams,
} from './feedback-db.params';
import {
  Feedback,
  FeedbackArchived,
  FeedbackDraft,
  FeedbackDraftType,
  FeedbackEncryptedFields,
  FeedbackItemWithId,
  FeedbackListMap,
  FeedbackListType,
  FeedbackPreRequestDetails,
  FeedbackPreRequestSummary,
  FeedbackPreRequestToken,
  FeedbackRequest,
  FeedbackRequestDraft,
  FeedbackRequestDraftType,
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
import {
  NOT_ARCHIVED_FOR_GIVER,
  NOT_ARCHIVED_FOR_RECEIVER,
  feedbackPreRequestExpirationDate,
  isRecentFeedbackRequest,
  sortFeedbackItemsDesc,
  sumFeedbackArchived,
} from './feedback-db.utils';

@Injectable()
export class FeedbackDbService {
  private get feedbackCollection() {
    return this.firebaseService.db.collection(Collection.feedback);
  }

  private get feedbackPreRequestTokenCollection() {
    return this.firebaseService.db.collection(Collection.feedbackPreRequestToken);
  }

  private get feedbackRequestTokenCollection() {
    return this.firebaseService.db.collection(Collection.feedbackRequestToken);
  }

  private get feedbackDraftCollection() {
    return this.firebaseService.db.collection(Collection.feedbackDraft);
  }

  constructor(
    private firebaseService: FirebaseService,
    private cryptoService: CryptoService,
  ) {}

  async ping() {
    return !!(await this.feedbackCollection.get());
  }

  onFeedbackChanges(callback: (feedbacks: (FeedbackWithId | FeedbackRequestWithId)[]) => unknown) {
    return this.feedbackCollection.onSnapshot((snapshot) => {
      callback(
        snapshot.docChanges().map((docChange) => {
          const { id } = docChange.doc;
          const feedback = docChange.doc.data() as Feedback | FeedbackRequest;
          return { id, ...feedback };
        }),
      );
    });
  }

  // ----- Pre-request feedback -----

  async preRequestToken({ receiverEmail, message, shared }: FeedbackPreRequestTokenParams) {
    const preRequestToken: FeedbackPreRequestToken = this.encryptFeedback({
      receiverEmail,
      message,
      shared,
      expiresAt: feedbackPreRequestExpirationDate(),
      usedBy: [],
    });
    const token = (await this.feedbackPreRequestTokenCollection.add(preRequestToken)).id;
    return token;
  }

  async checkPreRequest(tokenId: string) {
    const tokenDoc = await this.feedbackPreRequestTokenCollection.doc(tokenId).get();
    if (!tokenDoc.exists) {
      return null;
    }

    const { receiverEmail, message, shared, expiresAt, usedBy } = tokenDoc.data() as FeedbackPreRequestToken;

    if (Date.now() > expiresAt) {
      return 'token_expired' as const;
    }
    if (usedBy.length >= FEEDBACK_PRE_REQUEST_MAX_USES) {
      return 'token_max_uses_reached' as const;
    }

    return this.decryptFeedback({ receiverEmail, message, shared }) satisfies FeedbackPreRequestSummary;
  }

  async preRequestEmail(token: string, giverEmail: string) {
    const tokenDoc = await this.feedbackPreRequestTokenCollection.doc(token).get();
    if (!tokenDoc.exists) {
      return null;
    }

    const { receiverEmail, message, shared, expiresAt, usedBy } = tokenDoc.data() as FeedbackPreRequestToken;

    if (Date.now() > expiresAt) {
      return 'token_expired' as const;
    }
    if (usedBy.length >= FEEDBACK_PRE_REQUEST_MAX_USES) {
      return 'token_max_uses_reached' as const;
    }

    if (usedBy.includes(giverEmail)) {
      return 'recipient_already_used' as const;
    }
    if (giverEmail === receiverEmail) {
      return 'recipient_forbidden' as const;
    }

    await this.feedbackPreRequestTokenCollection.doc(token).update({ usedBy: [...usedBy, giverEmail] });

    return this.decryptFeedback({ receiverEmail, message, shared }) satisfies FeedbackPreRequestSummary;
  }

  async getValidPreRequestList(receiverEmail: string) {
    const listDocs = await this.feedbackPreRequestTokenCollection.where('receiverEmail', '==', receiverEmail).get();

    const now = Date.now();
    const deletePromises: Promise<unknown>[] = [];
    const nonExpiredTokens: FeedbackPreRequestDetails[] = [];

    for (const doc of listDocs.docs) {
      const data = doc.data() as FeedbackPreRequestToken;

      if (now > data.expiresAt || data.usedBy.length >= FEEDBACK_PRE_REQUEST_MAX_USES) {
        deletePromises.push(doc.ref.delete());
      } else {
        nonExpiredTokens.push({
          ...this.decryptFeedback(data),
          token: doc.id,
          expiresInHours: Math.round((data.expiresAt - now) / 3_600_000),
          remainingUses: FEEDBACK_PRE_REQUEST_MAX_USES - data.usedBy.length,
        });
      }
    }

    await Promise.all(deletePromises);

    return nonExpiredTokens.sort((a, b) => b.expiresAt - a.expiresAt);
  }

  // ----- Request feedback and give requested feedback -----

  async request({ giverEmail, receiverEmail, message, shared }: FeedbackRequestParams) {
    const now = Date.now();
    const request: FeedbackRequest = this.encryptFeedback({
      giverEmail,
      receiverEmail,
      message,
      shared,
      requested: true,
      status: FeedbackRequestStatus,
      createdAt: now,
      updatedAt: now,
      archived: FeedbackArchived.No,
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

  async archiveRequest(feedbackId: string, viewerEmail: string) {
    const requestDoc = await this.feedbackCollection.doc(feedbackId).get();
    if (!requestDoc.exists) {
      return null;
    }
    const request = requestDoc.data() as FeedbackRequest;

    if (viewerEmail !== request.giverEmail && viewerEmail !== request.receiverEmail) {
      return null;
    }

    const tokenId = await this.revealRequestTokenId(feedbackId, request.giverEmail);
    if (!tokenId) {
      return null;
    }

    if (isRecentFeedbackRequest(request.updatedAt)) {
      return false;
    }

    const partialFeedbackRequest: Partial<FeedbackRequest> = {
      archived: FeedbackArchived.Both,
    };
    await this.feedbackCollection.doc(feedbackId).update(partialFeedbackRequest);

    await this.feedbackRequestTokenCollection.doc(tokenId).delete();
    await this.deleteDraft(request.giverEmail, FeedbackRequestDraftType, tokenId);
    return true;
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

    return this.decryptFeedback(docWithId<FeedbackRequestWithId>(requestDoc));
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

  async giveRequestedDraft(tokenId: string, { context, positive, negative, comment }: GiveRequestedFeedbackParams) {
    const request = await this.checkRequest(tokenId);
    if (!request) {
      return false;
    }

    const feedbackRequestDraft = this.encryptFeedback<FeedbackRequestDraft>({
      token: tokenId,
      receiverEmail: request.receiverEmail,
      context,
      positive,
      negative,
      comment,
    });
    await this.feedbackDraftCollection
      .doc(request.giverEmail)
      .collection(FeedbackRequestDraftType)
      .doc(tokenId)
      .set(feedbackRequestDraft, { merge: true });
    return true;
  }

  async giveRequested(tokenId: string, { context, positive, negative, comment }: GiveRequestedFeedbackParams) {
    const request = await this.checkRequest(tokenId);
    if (!request) {
      return false;
    }

    const feedbackId = request.id;
    const partialFeedback: Partial<Feedback> = this.encryptFeedback({
      context,
      positive,
      negative,
      comment,
      status: FeedbackStatus,
      updatedAt: Date.now(),
    });
    await this.feedbackCollection.doc(feedbackId).update(partialFeedback);

    await this.feedbackRequestTokenCollection.doc(tokenId).delete();
    await this.deleteDraft(request.giverEmail, FeedbackRequestDraftType, tokenId);

    const { giverEmail, receiverEmail, shared } = request;
    return { giverEmail, receiverEmail, shared, feedbackId };
  }

  // ----- Give spontaneous feedback -----

  async giveDraft({ giverEmail, receiverEmail, context, positive, negative, comment, shared }: GiveFeedbackParams) {
    const feedbackDraft = this.encryptFeedback<FeedbackDraft>({
      receiverEmail,
      context,
      positive,
      negative,
      comment,
      shared,
    });
    await this.feedbackDraftCollection
      .doc(giverEmail)
      .collection(FeedbackDraftType)
      .doc(receiverEmail)
      .set(feedbackDraft, { merge: true });
  }

  async give({ giverEmail, receiverEmail, context, positive, negative, comment, shared }: GiveFeedbackParams) {
    const now = Date.now();
    const feedback: Feedback = this.encryptFeedback({
      giverEmail,
      receiverEmail,
      context,
      positive,
      negative,
      comment,
      message: '',
      shared,
      requested: false,
      status: FeedbackStatus,
      createdAt: now,
      updatedAt: now,
      archived: FeedbackArchived.No,
    });
    const feedbackRef = await this.feedbackCollection.add(feedback);
    const { id } = await feedbackRef.get();

    await this.deleteDraft(giverEmail, FeedbackDraftType, receiverEmail);

    return { id } as IdObject;
  }

  // ----- Manage feedback draft -----

  async deleteDraft(
    giverEmail: string,
    type: FeedbackDraftType | FeedbackRequestDraftType,
    receiverEmailOrToken: string,
  ) {
    await this.feedbackDraftCollection.doc(giverEmail).collection(type).doc(receiverEmailOrToken).delete();
  }

  getDraft(giverEmail: string, type: FeedbackDraftType, receiverEmail: string): Promise<FeedbackDraft>;

  getDraft(giverEmail: string, type: FeedbackRequestDraftType, token: string): Promise<FeedbackRequestDraft>;

  async getDraft(giverEmail: string, type: FeedbackDraftType | FeedbackRequestDraftType, receiverEmailOrToken: string) {
    const draftDoc = await this.feedbackDraftCollection
      .doc(giverEmail)
      .collection(type)
      .doc(receiverEmailOrToken)
      .get();
    if (!draftDoc.exists) {
      return undefined;
    }
    return this.decryptFeedback(draftDoc.data() as FeedbackDraft | FeedbackRequestDraft);
  }

  getDraftList(giverEmail: string, type: FeedbackDraftType): Promise<FeedbackDraft[]>;

  getDraftList(giverEmail: string, type: FeedbackRequestDraftType): Promise<FeedbackRequestDraft[]>;

  async getDraftList(
    giverEmail: string,
    type: FeedbackDraftType | FeedbackRequestDraftType,
  ): Promise<FeedbackDraft[] | FeedbackRequestDraft[]> {
    const draftQuery = await this.feedbackDraftCollection.doc(giverEmail).collection(type).get();

    return sortList(
      draftQuery.docs.map((doc) => this.decryptFeedback(doc.data())),
      'receiverEmail',
    ) as FeedbackDraft[] | FeedbackRequestDraft[];
  }

  // ----- Archive feedback (with status "done") -----

  async archive(feedbackId: string, archivedByEmail: string) {
    const feedbackDoc = await this.feedbackCollection.doc(feedbackId).get();
    if (!feedbackDoc?.exists) {
      return false;
    }
    const feedback = feedbackDoc.data() as Feedback;

    let extra: FeedbackArchived = FeedbackArchived.No;
    if (feedback.giverEmail === archivedByEmail) {
      extra = FeedbackArchived.Giver;
    } else if (feedback.receiverEmail === archivedByEmail) {
      extra = FeedbackArchived.Receiver;
    } else {
      return false;
    }
    const archived = sumFeedbackArchived(feedback.archived, extra);
    if (archived === null) {
      return false;
    }

    const partialFeedback: Partial<Feedback> = {
      archived,
    };
    await this.feedbackCollection.doc(feedbackId).update(partialFeedback);
    return true;
  }

  // ----- View feedbacks (requested and given) -----

  async getListMap(viewerEmail: string, types: FeedbackListType[]): Promise<FeedbackListMap> {
    const feedbackListMap: FeedbackListMap = {
      received: [],
      given: [],
      sentRequest: [],
      receivedRequest: [],
    };
    if (types.includes('received')) {
      feedbackListMap.received = await this.getReceivedList(viewerEmail);
    }
    if (types.includes('given')) {
      feedbackListMap.given = await this.getGivenList(viewerEmail);
    }
    if (types.includes('sentRequest')) {
      feedbackListMap.sentRequest = await this.getSentRequestList(viewerEmail);
    }
    if (types.includes('receivedRequest')) {
      feedbackListMap.receivedRequest = await this.getReceivedRequestList(viewerEmail);
    }
    return feedbackListMap;
  }

  private async getReceivedList(receiverEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where('status', '==', FeedbackStatus)
      .where('receiverEmail', '==', receiverEmail)
      .where('archived', 'in', NOT_ARCHIVED_FOR_RECEIVER)
      .select(...feedbackItemFields)
      .orderBy('updatedAt' satisfies keyof Feedback, 'desc')
      .get();

    return docsWithId<FeedbackItemWithId>(feedbackQuery.docs);
  }

  private async getGivenList(giverEmail: string) {
    const feedbackQuery = await this.feedbackCollection
      .where('status', '==', FeedbackStatus)
      .where('giverEmail', '==', giverEmail)
      .where('archived', 'in', NOT_ARCHIVED_FOR_GIVER)
      .select(...feedbackItemFields)
      .orderBy('updatedAt' satisfies keyof Feedback, 'desc')
      .get();

    return docsWithId<FeedbackItemWithId>(feedbackQuery.docs);
  }

  private async getSentRequestList(receiverEmail: string) {
    const feedbackRequestQuery = await this.feedbackCollection
      .where('status', '==', FeedbackRequestStatus)
      .where('receiverEmail', '==', receiverEmail)
      .where('archived', 'in', NOT_ARCHIVED_FOR_RECEIVER)
      .select(...feedbackItemFields)
      .orderBy('createdAt' satisfies keyof Feedback, 'desc')
      .get();

    return docsWithId<FeedbackRequestItemWithId>(feedbackRequestQuery.docs);
  }

  private async getReceivedRequestList(giverEmail: string) {
    const feedbackRequestQuery = await this.feedbackCollection
      .where('status', '==', FeedbackRequestStatus)
      .where('giverEmail', '==', giverEmail)
      .where('archived', 'in', NOT_ARCHIVED_FOR_GIVER)
      .select(...feedbackItemFields)
      .orderBy('createdAt' satisfies keyof Feedback, 'desc')
      .get();

    return docsWithId<FeedbackRequestItemWithId>(feedbackRequestQuery.docs);
  }

  async getDocument(viewerEmail: string, id: string): Promise<FeedbackWithId | FeedbackRequestWithId | null> {
    const feedbackQuery = await this.feedbackCollection.where(FieldPath.documentId(), '==', id).get();

    const feedbackDoc = feedbackQuery.docs.at(0);
    if (!feedbackDoc) {
      return null;
    }

    const document = this.decryptFeedback(docWithId<FeedbackWithId | FeedbackRequestWithId>(feedbackDoc));

    const isViewerAuthorized =
      (viewerEmail === document.receiverEmail &&
        (NOT_ARCHIVED_FOR_RECEIVER as unknown as number[]).includes(document.archived)) ||
      (viewerEmail === document.giverEmail &&
        (NOT_ARCHIVED_FOR_GIVER as unknown as number[]).includes(document.archived));

    return isViewerAuthorized ? document : null;
  }

  async getSharedFeedbackList(receiverEmail: string) {
    // Note: the manager can see the "done" feedback, even if it has been archived by the "receiver" or the "giver"
    const feedbackQuery = await this.feedbackCollection
      .where('status', '==', FeedbackStatus)
      .where('receiverEmail', '==', receiverEmail)
      .where('shared', '==', true)
      .select(...feedbackItemFields)
      .get();

    // Note: the manager does not need to see a feedback request that has been archived
    const feedbackRequestQuery = await this.feedbackCollection
      .where('status', '==', FeedbackRequestStatus)
      .where('receiverEmail', '==', receiverEmail)
      .where('archived', 'in', [FeedbackArchived.No]) // archived feedback requests will not be returned by this query
      .where('shared', '==', true)
      .select(...feedbackItemFields)
      .get();

    return sortFeedbackItemsDesc([
      ...docsWithId<FeedbackItemWithId>(feedbackQuery.docs),
      ...docsWithId<FeedbackRequestItemWithId>(feedbackRequestQuery.docs),
    ]);
  }

  async getSharedFeedbackDocument(id: string): Promise<FeedbackWithId | FeedbackRequestWithId | null> {
    const feedbackQuery = await this.feedbackCollection
      .where(FieldPath.documentId(), '==', id)
      .where('shared', '==', true)
      .get();

    const feedbackDoc = feedbackQuery.docs.at(0);
    if (!feedbackDoc) {
      return null;
    }

    const document = this.decryptFeedback(docWithId<FeedbackWithId | FeedbackRequestWithId>(feedbackDoc));

    // Note: the manager does not need to see a feedback request that has been archived
    if (document.status === FeedbackRequestStatus && document.archived === FeedbackArchived.Both) {
      return null;
    }

    return document;
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
      output[field] = this.cryptoService[operation](output[field]);
    });
    return output;
  }
}
