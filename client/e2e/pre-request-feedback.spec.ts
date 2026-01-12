import { expect, test } from '@playwright/test';
import { FeedbackHistoryDetailsPage } from './pages/feedback-history-details.page';
import { FeedbackHistoryPage } from './pages/feedback-history.page';
import { FirestorePage } from './pages/firestore.page';
import { PreRequestFeedbackEmailPage } from './pages/pre-request-feedback-email.page';
import { PreRequestFeedbackTokenPage } from './pages/pre-request-feedback-token.page';
import { Persona, SignInPage } from './pages/sign-in.page';
import { UserMenuPage } from './pages/user-menu.page';

const feedbackMessage = 'Quel est votre feedback ?';

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Pre-request feedback', async ({ page }) => {
  // ====== Alfred generate magic link ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  const magicLink = await new PreRequestFeedbackTokenPage(page).gotoGenerateAndGetMagicLinkFromSuccess(feedbackMessage);

  const magicLinkFromDialog = await new PreRequestFeedbackTokenPage(page).gotoAndCheckMagicLinkFromDialog(0);

  expect(magicLinkFromDialog, 'Magic link from dialog matches the one from success-page').toEqual(magicLink);

  await new UserMenuPage(page).signOut();

  // ====== Bernard use magic link (not authenticated) ======

  const preRequestEmail = new PreRequestFeedbackEmailPage(page);
  await preRequestEmail.goto(magicLink);
  await preRequestEmail.checkDetails(Persona.Alfred, feedbackMessage);
  await preRequestEmail.submitEmail(Persona.Bernard);

  // ====== Bernard checks the requested feedback (from Alfred) is ready to be replied ======

  await new SignInPage(page).gotoAndSignIn(Persona.Bernard);

  const bernardHistoryPage = new FeedbackHistoryPage(page);
  await bernardHistoryPage.goto('receivedRequest');

  const alfredDetailsLink = await bernardHistoryPage.findDetailsLink(Persona.Alfred);
  await expect(
    alfredDetailsLink,
    'Feedback receiver should be visible in the page "Répondre aux demandes de feedZback"',
  ).toBeVisible();
  await alfredDetailsLink.click();

  await new FeedbackHistoryDetailsPage(page).matchPending('receivedRequest', Persona.Alfred, feedbackMessage);
});
