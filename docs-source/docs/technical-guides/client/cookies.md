# Cookies

The application is available in two languages: English and French. The `app-locale-id` cookie reflects the language used by the client. This cookie must be provided in certain HTTP requests.

For example, when the user sends a feedZback request, the server sends an email to the recipient. And the generic messages used in this email must be in the same language as that chosen by the sender (of course, nothing prevents the sender from writing his custom message in another language, understood by the recipient).

Technically, the `app-locale-id` cookie is managed by the [`LanguageService`](https://github.com/Zenika/feedzback/blob/main/client/src/app/shared/i18n/language/language.service.ts).
And when this cookie is required, the `{ withCredendials : true }` option is used in the configuration of the HTTP request concerned.

This configuration is mainly used in [`FeedbackService`](https://github.com/Zenika/feedzback/blob/main/client/src/app/shared/feedback/feedback.service.ts).

```ts
this.httpClient.post('[endpoint]', {}, { withCredentials: true });
```
