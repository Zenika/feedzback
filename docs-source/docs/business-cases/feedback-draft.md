# Feedback draft

## User story

When I reply to a feedback request or give spontaneous feedback, If I can't complete my feedback in one go, I'd like to be able to save it as a draft and continue later.

## Technical specifications

The drafts are stored in the `feedbackDraft` Firestore collection.

The document ID is `giverEmail` (who wrote and saved the draft), whether he is internal or external to the Zenika organisation.

For a given `giverEmail`, there can be 2 nested collections:

- `feedbackRequest`: contains drafts saved when replying to a feedback request
- `feedback`: contains drafts saved when giving a spontaneous feedback

### `feedbackRequest` drafts

In this collection, the document ID is the `tokenId` and the document contains the following fields:

```ts
const feedbackRequestDraft: FeedbackRequestDraft = {
  token: '123secret', // Redondant data - same value as the document ID itself
  receiverEmail: 'pinochio@zenika.com', // Redondant data - already available in the original `FeedbackRequest` document

  // ----------------------------
  // The relevant data start here
  positive: 'You did great...', // Might be empty because its just a draft
  negative: '', // Might be empty because its just a draft
  comment: '',
};
```

:::note
The redundant field `receiverEmail` has been added to be able to display the list of drafts by recipient.
:::

### `feedback` drafts

In this collection, the document ID is the `receiverEmail` and the document contains the following fields:

```ts
const feedbackDraft: FeedbackDraft = {
  receiverEmail: 'pinochio@zenika.com', // Redondant data - same value as the document ID itself

  // ----------------------------
  // The relevant data start here
  positive: 'You did great...', // Might be empty because its just a draft
  negative: '', // Might be empty because its just a draft
  comment: '',
  shared: true,
};
```

## Links

- **Client**
  - [`GiveRequestedFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.component.ts)
  - [`GiveFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-feedback/give-feedback.component.ts)
  - [`GiveFeedbackDraftComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-feedback/give-feedback-draft/give-feedback-draft.component.ts)
  - [`GiveFeedbackDraftService`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-feedback/give-feedback-draft/give-feedback-draft.service.ts)
- **Server**
  - [`FeedbackController`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `giveRequestedDraft`
    - `giveDraft`
