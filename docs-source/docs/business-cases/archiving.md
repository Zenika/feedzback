# Archiving

## User story

After a month, I'd like to be able to archive a feedback request that has not been replied.
Once archived, the feedback request can no longer be replied.

I'd like to be able to archive the feedbacks I've received or sent after reading them.

## Technical specifications

Archived feedback should not simply be deleted from the database, as they are used for statistical purposes.
Instead, there is an `archived` field in the each feedback.

The difficulty is that the feedback document is shared between the `giverEmail` and the `receiverEmail`.
As a result, the `archived` field cannot be a simple boolean.
Instead, this field has a numeric value with the following meaning:

```ts title="server/src/feedback/feedback-db/feedback-db.types.ts"
// Explanation of possible values for field `Feedback['archived']`:
//    == 0   ->   archived for no-one
//    == 1   ->   archived for the receiver
//    == 2   ->   archived for the giver
//    == 3   ->   archived for both the receiver and the giver

export const FeedbackArchived = {
  No: 0,
  Receiver: 1,
  Giver: 2,
  Both: 3,
} as const;
```

To archive a feedback (requested, given or received), i have to click on the button "Archive" in the feedback details page:

```txt
/history/id/<feedbackId>
```

## Links

- **Client**
  - [`FeedbackDetailsComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/feedback-details/feedback-details.component.ts)
  - [`PendingFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/shared/feedback/pending-feedback/pending-feedback.component.ts)
  - [`DoneFeedbackComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/shared/feedback/done-feedback/done-feedback.component.ts)
- **Server**
  - [`FeedbackController`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `archive-request`
    - `archive`
