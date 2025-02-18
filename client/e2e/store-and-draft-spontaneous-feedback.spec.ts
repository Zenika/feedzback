import { expect, test } from '@playwright/test';
import { FirestorePage } from './pages/firestore.page';
import { GiveSpontaneousFeedbackPage } from './pages/give-spontaneous-feedback.page';
import { Persona, SignInPage } from './pages/sign-in.page';

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Store and draft spontaneous feedback', async ({ page }) => {
  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  // ====== Write a partial feedback (without saving it) and then reload the page ======

  const feedbackPage = new GiveSpontaneousFeedbackPage(page);
  await feedbackPage.goto();
  await feedbackPage.fill(Persona.Bernard, {
    context: "J'ai travaillé avec Bernard...",
    positive: 'Ok',
  });

  await page.reload();

  // ====== Feedback is not lost but restored from local storage ======

  await feedbackPage.expect(Persona.Bernard, {
    context: "J'ai travaillé avec Bernard...",
    positive: 'Ok',
  });

  // ====== Save the feedback as a draft, write some more feedback and then reload the page ======

  await feedbackPage.saveAsDraft();

  await page.reload();

  // ====== When returning to the page, the feedback form is empty ======

  await feedbackPage.expect('', {
    context: '',
    positive: '',
  });

  // ====== Applying the feedback draft and completing the feedback ======

  await feedbackPage.applyDraft(Persona.Bernard);

  await feedbackPage.fill(undefined, {
    negative: 'Ko',
    comment: 'R.A.S',
  });

  await feedbackPage.expect(Persona.Bernard, {
    context: "J'ai travaillé avec Bernard...",
    positive: 'Ok',
    negative: 'Ko',
    comment: 'R.A.S',
  });

  // ====== Submitting the feedback and checking the result page ======

  await feedbackPage.submit();

  await expect(
    page.getByText(Persona.Bernard),
    'Feedback receiver should be visible in the success page',
  ).toBeVisible();
});
