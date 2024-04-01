# Give spontaneous feedback

## User story

As an internal member of the Zenika organisation, I'd like to be able to send spontaneous feedback to a colleague I've worked with.
If I can't complete my feedback in one go, I'd like to be able to save it as a draft and continue later.

## Technical specifications

Be sure to read [Request feedback](./request-feedback) and [Reply to feedback request](./reply-to-feedback-request) first.
To learn more about draft, read the [Feedback draft](./feedback-draft) documentation.

The requester must be authenticated.

This workflow is much simpler than the feedback request workflow.

Once the feedback is complete, only 1 Firestore document is added:

```ts
const feedback: Feedback = {
  giverEmail: 'gimini@zenika.com',
  receiverEmail: 'pinocchio@zenika.com',

  // --------------------------------------
  // In reality, the contents are encrypted
  positive: 'You did great...',
  negative: 'Youd should improve...',
  comment: 'See you...',
  // --------------------------------------

  message: '',
  shared: true,
  requested: false, // Meaning it's a spontaneous feedback
  status: 'done',
  createdAt: 1711403799463,
  updatedAt: 1711712182618,
  archived: 0,
};
```

An email is sent to the `receiverEmail` inviting them to consult the feedback they have just received.

## Links

- **Client**
  - [`GiveFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-feedback/give-feedback.component.ts)
- **Server**
  - [`FeedbackController`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `give`
