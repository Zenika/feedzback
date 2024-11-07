# Shared feedback

## User story

When I send a feedback request, I can choose whether or not to share the expected feedback with my manager.

When I give spontaneous feedback to a colleague, I can choose whether or not to share it with their manager.

Feedbacks are shared with the manager defined in the application settings.
This means that when I change manager, all my shared feedbacks are shared with my new manager.

As a manager, I'd like to be able to view the feedback that the employees I manage have received and shared with me.

## Technical specifications

A feedback is shared with the manager of the `receiverEmail` if the field `shared` of the `feedback` document is set to `true`:

```ts
const feedbackRequest: FeedbackRequest = {
  shared: true,
  ...
};

const feedback: Feedback = {
  shared: true,
  ...
};
```

:::note
This `shared` field is only set when requesting a feedback or when giving a spontaneous feedback and cannot be changed thereafter.
:::

### As an employee, define my manager

The `employee` Firestore collection contains the manager/managed data.

When an employee defines his manager, 2 documents are updated:

```ts
const theManagedDocument: EmployeeData = {
  managerEmail: '<managerEmail>',
};

const theManagerDocument: EmployeeData = {
  managedEmails: ['<managedEmail>'],
};
```

When an employee updates his manager, a third document is updated because the `<managedEmail>` must be deleted from the previous manager's document.

### As a manager, view my shared feedbacks

An employee is a manager if there is at least one element in its `managedEmails` array.
In this case, the "Manager" button is displayed in the header menu.
From there, the manager can access the shared feedbacks.

## Links

- **Client**
  - [`SettingsComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/settings/settings.component.ts)
  - [`ManagerListComponent`](https://github.com/Zenika/feedzback/blob/main/client/src/app/manager/manager-list/manager-list.component.ts)
- **Server**
  - [`EmployeeController`](https://github.com/Zenika/feedzback/blob/main/server/src/employee/employee.controller.ts)
  - [`FeedbackController`](https://github.com/Zenika/feedzback/blob/main/server/src/feedback/feedback.controller.ts)
    - `getSharedFeedbackList`
    - `getSharedFeedbackDocument`
