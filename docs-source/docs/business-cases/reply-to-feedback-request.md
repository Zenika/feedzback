# Reply to feedback request

## User story

As I have received a feedback request, I would like to be able to reply to this request.
If I can't complete my feedback in one go, I'd like to be able to save it as a draft and continue later.

## Technical specifications

To reply to a feedback request, the `giverEmail` must use its secret `tokenId` and visit the page:

```txt
/give-requested/token/<tokenId>
```

This page does not require the `giverEmail` to be authenticated, as the `tokenId` is a secret data.
A link to this page can be found in the email received by the `giverEmail`.

If the `giverEmail` is external to the Zenika organisation, this link is the only way to reply.
If the `giverEmail` is internal to the Zenika organisation, they can also connect to the application and access the list of feedback requests they have received.

If the user is not authenticated, the page remains accessible and the `giverEmail` is silently authenticated as an anonymous user.
In other words, a session is created.

## Links

- **Client**
  - [giveRequestedFeedbackGuard](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.guard.ts)
  - [GiveRequestedFeedbackComponent](https://github.com/Zenika/feedzback/blob/main/client/src/app/give-feedback/give-requested-feedback/give-requested-feedback.component.ts)
- **Server**
  - [FeedbackController](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `checkRequest`
    - `giveRequestedDraft`
    - `giveRequested`
