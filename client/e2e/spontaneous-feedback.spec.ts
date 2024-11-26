import { expect, test } from '@playwright/test';
import { FeedbackHistoryDetailsPage } from './pages/feedback-history-details.page';
import { FeedbackHistoryPage } from './pages/feedback-history.page';
import { FirestorePage } from './pages/firestore.page';
import { GiveSpontaneousFeedbackPage } from './pages/give-spontaneous-feedback.page';
import { Persona, SignInPage } from './pages/sign-in.page';
import { UserMenuPage } from './pages/user-menu.page';

const feedbackDetails = {
  positive: 'Ok',
  negative: 'Ko',
  comment: 'R.A.S',
} as const;

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Spontaneous feedback', async ({ page }) => {
  // ====== Bernard give feedback to Alfred ======

  await new SignInPage(page).gotoAndSignIn(Persona.Bernard);

  await new GiveSpontaneousFeedbackPage(page).gotoAndGive(Persona.Alfred, feedbackDetails);

  // See the persona in the success page
  await expect(page.getByText(Persona.Alfred)).toBeVisible();
  await page.getByRole('button', { name: 'Consulter le feedZback' }).click();

  await new FeedbackHistoryDetailsPage(page).matchDone('given', Persona.Alfred, feedbackDetails);

  await new UserMenuPage(page).logout();

  // ====== Alfred has received feedback from Bernard ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  const alfredHistoryPage = new FeedbackHistoryPage(page);
  await alfredHistoryPage.goto('received');

  const bernardDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Bernard);
  await expect(bernardDetailsLink).toBeVisible();
  await bernardDetailsLink.click();

  await new FeedbackHistoryDetailsPage(page).matchDone('received', Persona.Bernard, feedbackDetails);
});
