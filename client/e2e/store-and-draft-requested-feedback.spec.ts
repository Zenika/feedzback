import { expect, test } from '@playwright/test';
import { FeedbackHistoryPage } from './pages/feedback-history.page';
import { FirestorePage } from './pages/firestore.page';
import { GiveRequestedFeedbackPage } from './pages/give-requested-feedback.page';
import { RequestFeedbackPage } from './pages/request-feedback.page';
import { Persona, SignInPage } from './pages/sign-in.page';
import { UserMenuPage } from './pages/user-menu.page';

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Store and draft requested feedback', async ({ page }) => {
  // ====== Alfred request feedback from Bernard ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  await new RequestFeedbackPage(page).gotoAndRequest([Persona.Bernard], 'Quel est votre feedback ?');

  await new UserMenuPage(page).signOut();

  // ====== Bernard replies to Alfred's request ======

  await new SignInPage(page).gotoAndSignIn(Persona.Bernard);

  const bernardHistoryPage = new FeedbackHistoryPage(page);
  await bernardHistoryPage.goto('receivedRequest');

  const alfredReplyLink = await bernardHistoryPage.findReplyLink(Persona.Alfred);
  await alfredReplyLink.click();

  // ====== Write a partial feedback (without saving it) and then reload the page ======

  const feedbackPage = new GiveRequestedFeedbackPage(page);

  await feedbackPage.fill({
    context: "J'ai travaillé avec Bernard...",
  });

  await page.reload();

  // ====== Feedback is not lost but restored from local storage ======

  await feedbackPage.expect(Persona.Alfred, {
    context: "J'ai travaillé avec Bernard...",
  });

  // ====== Save the feedback as a draft, write some more feedback and then reload the page ======

  await page.getByRole('button', { name: 'Sauvegarder' }).click();

  await feedbackPage.fill({
    positive: 'Ok',
  });

  await page.reload();

  // ====== Resolve the conflict between local storage and the saved draft by choosing "Restore local storage" ======

  await page.getByRole('button', { name: 'Restaurer' }).click();

  await feedbackPage.expect(Persona.Alfred, {
    context: "J'ai travaillé avec Bernard...",
    positive: 'Ok', // <-- It comes from the local storage
  });

  // ====== Reload the page, but this time, resolve the conflict by choosing "Discard local storage" ======

  await page.reload();

  await page.getByRole('button', { name: 'Abandonner' }).click();

  await feedbackPage.expect(Persona.Alfred, {
    context: "J'ai travaillé avec Bernard...",
    positive: '', // <-- It comes from the saved draft
  });

  // ====== Completing and submitting the feedback ======

  await feedbackPage.fill({
    positive: 'Ok',
    negative: 'Ko',
    comment: 'R.A.S',
  });

  await feedbackPage.submit();

  await expect(page.getByText(Persona.Alfred), 'Feedback receiver should be visible in the success page').toBeVisible();
});
