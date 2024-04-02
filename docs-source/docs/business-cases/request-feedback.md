# Request feedback

## User story

As a Zenika employee, I would like to request feedback from colleagues I have worked with, whether they are internal or external to my organisation.

Each colleague then receives an email containing a link enabling them to reply to my feedback request.

For external colleagues, this link is the only way for them to reply.
Whereas internal colleagues can also connect to the application and view the list of feedback requests they have received.

Once my request has been sent, I would like to view the list of my pending feedback requests.

## Technical specifications

The requester must be authenticated.

The request can be sent to one or more recipients.

For each recipient, 2 documents are added to the database:

- A document is added to the `feedback` collection.
  It contains the details of the request (`giverEmail`, `receiverEmail`, ...).
  The ID of this document is called the `feedbackId`.

- A document is added to the `feedbackRequestToken` collection.
  It contains a reference to the `feedbackId`.
  The ID of this document is called the `tokenId`.

For example, if Pinocchio sends a feedback request to Gimini, the first added document should look like this:

```ts
const feedbackRequest: FeedbackRequest = {
  giverEmail: 'gimini@zenika.com',
  receiverEmail: 'pinocchio@zenika.com',
  message: 'Hi Gimini, give me some feedback please.', // In reality, the content is encrypted.
  shared: true,
  requested: true, // Indicates that the feedback was initiated by a request.
  status: 'pending',
  createdAt: 1711403799463,
  updatedAt: 1711403799463,
  archived: 0,
};
```

From a feedback point of view, the requester is the `receiverEmail` (who will receive the feedback) and the recipient of the request is the `giverEmail` (who will give the feedback).

The second added document should look like this:

```ts
const feedbackRequestToken: FeedbackRequestToken = {
  feedbackId: '123secret';
};
```

The `feedbackId` is shared between the `receiverEmail` and the `giverEmail`.
Both have access to the page:

```txt
/history/id/<feedbackId>
```

The `tokenId`, on the other hand, is a secret value known only to the `giverEmail`, who can reply to the feedback request by visiting the page:

```txt
/give-requested/token/<tokenId>
```

Each `giverEmail` receives an email with a link to this page, based on their own `tokenId` allowing them to reply.

## Links

- **Client**
  - [`RequestFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/request-feedback/request-feedback.component.ts)
- **Server**
  - [`FeedbackController`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `request`
