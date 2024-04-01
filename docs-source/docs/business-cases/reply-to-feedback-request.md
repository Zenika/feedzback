# Reply to feedback request

## User story

As I have received a feedback request, I would like to be able to reply to this request.
If I can't complete my feedback in one go, I'd like to be able to save it as a draft and continue later.

## Technical specifications

Be sure to read [Request feedback](./request-feedback) first.
To learn more about draft, read the [Feedback draft](./feedback-draft) documentation.

To reply to a feedback request, the `giverEmail` must visit the following page, based on its secret `tokenId`:

```txt
/give-requested/token/<tokenId>
```

As the `giverEmail` may be external to the Zenika organisation, access to this page does not require user authentification.
Instead, the `tokenId` acts as an access token.

On client side, the [`giveRequestedFeedbackGuard`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.guard.ts) guard ensures that the `tokenId` is valid.
If the `giverEmail` is already authenticated, it remains authenticated.
Otherwise, he is silently authenticated as an anonymous user (in other words, a session is created for him).

On server side, the [`FeedbackController.checkRequest`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts) method returns the feedback request details and possibly a previously saved draft.

Once the feedback is complete, 2 or 3 Firestore documents are affected:

- In the `feedback` collection, the document with ID `feedbackId` is updated:

```ts
const feedback: Feedback = {
  giverEmail: 'gimini@zenika.com',
  receiverEmail: 'pinocchio@zenika.com',

  // -----------------------------------------------------
  // Added fields (in reality, the contents are encrypted)
  positive: 'You did great...', // required
  negative: 'Youd should improve...', // required
  comment: '', // optional
  // -----------------------------------------------------

  message: 'Hi Gimini, give me some feedback please.',
  shared: true,
  requested: true,
  status: 'done', // Updated field
  createdAt: 1711403799463,
  updatedAt: 1711712182618, // Updated field
  archived: 0,
};
```

- In the `feedbackRequestToken` collection, the document with ID `tokenId` is deleted.

- In the `feedbackDraft` collection, the draft, if it exists, is deleted.

Finally, an email is sent to the `receiverEmail` inviting them to consult the feedback they have just received.

## Links

- **Client**
  - [`giveRequestedFeedbackGuard`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.guard.ts)
  - [`GiveRequestedFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.component.ts)
- **Server**
  - [`FeedbackController`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `checkRequest`
    - `giveRequested`
