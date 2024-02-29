import { Injectable } from '@nestjs/common';
import { FieldPath } from 'firebase-admin/firestore';
import { CryptoService } from '../../core/crypto/crypto.service';
import { FirebaseService, docWithId, docsWithId, sortList } from '../../core/firebase';
import { Collection, feedbackItemFields } from './feedback-db.config';
import { FeedbackRequestParams, GiveFeedbackParams, GiveRequestedFeedbackParams } from './feedback-db.params';
import {
  Feedback,
  FeedbackArchived,
  FeedbackDraft,
  FeedbackDraftType,
  FeedbackEncryptedFields,
  FeedbackItemWithId,
  FeedbackListMap,
  FeedbackListType,
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
  isRecentFeedbackRequest,
  sortFeedbackItemsDesc,
} from './feedback-db.utils';

@Injectable()
export class FeedbackDbService {
  private get feedbackCollection() {
    return this.firebaseService.db.collection(Collection.feedback);
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

  onFeedbackChanges(callback: (feedbacks: FeedbackWithId[]) => unknown) {
    return this.feedbackCollection.where('status', '==', FeedbackStatus).onSnapshot((snapshot) => {
      callback(
        snapshot.docChanges().map((docChange) => {
          const { id } = docChange.doc;
          const feedback = docChange.doc.data() as Feedback;
          return { id, ...feedback };
        }),
      );
    });
  }

  // #############################################################################
  // #############################################################################
  // PATCH FEEDBACK COLLECTION ADDING "archived: 0" FIELD FOR ALL EXISTING ENTRIES
  // ---- REMOVE THIS CODE AFTER THE COLLECTION HAS BEEN PATCHED IN PRODUCTION ---
  async PATCH_FEEDBACK_COLLECTION() {
    const feedbacksDocs = await this.feedbackCollection.listDocuments();
    feedbacksDocs.forEach(async (doc) => {
      try {
        await doc.update({
          archived: FeedbackArchived.No,
        } satisfies Partial<FeedbackRequest>);
        console.log(`PATCH [OK]: "archived: 0" added to feedback id=${doc.id}`);
      } catch (err) {
        console.error(`PATCH [KO]: "archived: 0" added to feedback id=${doc.id}`);
      }
    });
  }
  // #############################################################################
  // #############################################################################

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

  async cancelRequest(feedbackId: string, receiverEmail: string) {
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
      return false;
    }

    const feedbackRequestDraft = this.encryptFeedback<FeedbackRequestDraft>({
      token: tokenId,
      receiverEmail: request.receiverEmail,
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

  async giveRequested(tokenId: string, { positive, negative, comment }: GiveRequestedFeedbackParams) {
    const request = await this.checkRequest(tokenId);
    if (!request) {
      return false;
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
    await this.deleteDraft(request.giverEmail, FeedbackRequestDraftType, tokenId);

    const { giverEmail, receiverEmail, shared } = request;
    return { giverEmail, receiverEmail, shared, feedbackId };
  }

  // ----- Give spontaneous feedback -----

  async giveDraft({ giverEmail, receiverEmail, positive, negative, comment, shared }: GiveFeedbackParams) {
    const feedbackDraft = this.encryptFeedback<FeedbackDraft>({
      receiverEmail,
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
    // Note: the manager can see the "done" feedback even if it has been archived
    const feedbackQuery = await this.feedbackCollection
      .where('status', '==', FeedbackStatus)
      .where('receiverEmail', '==', receiverEmail)
      .where('shared', '==', true)
      .select(...feedbackItemFields)
      .get();

    // Note: it makes no sense to show the manager feedback that has been cancelled
    const feedbackRequestQuery = await this.feedbackCollection
      .where('status', '==', FeedbackRequestStatus)
      .where('receiverEmail', '==', receiverEmail)
      .where('archived', 'in', [FeedbackArchived.No])
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
      output[field] = this.cryptoService[operation](output[field]!);
    });
    return output;
  }
}
