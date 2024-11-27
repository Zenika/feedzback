import { expect, test } from '@playwright/test';
import { FeedbackHistoryDetailsPage } from './pages/feedback-history-details.page';
import { FeedbackHistoryPage } from './pages/feedback-history.page';
import { FirestorePage } from './pages/firestore.page';
import { GiveRequestedFeedbackPage } from './pages/give-requested-feedback.page';
import { ManagerPage } from './pages/manager.page';
import { RequestFeedbackPage } from './pages/request-feedback.page';
import { SettingsPage } from './pages/settings.page';
import { Persona, SignInPage } from './pages/sign-in.page';
import { UserMenuPage } from './pages/user-menu.page';

const feedbackDetails = {
  message: 'Quel est votre feedback ?',
  positive: 'Ok',
  negative: 'Ko',
  comment: 'R.A.S',
} as const;

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Requested feedback', async ({ page }) => {
  // ====== Alfred request feedback from Bernard and Charles ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  await new RequestFeedbackPage(page).gotoAndRequest([Persona.Bernard, Persona.Charles], feedbackDetails.message);

  // See the personas in the success page
  await expect(page.getByText(Persona.Bernard)).toBeVisible();
  await expect(page.getByText(Persona.Charles)).toBeVisible();

  const alfredHistoryPage = new FeedbackHistoryPage(page);
  await alfredHistoryPage.goto('sentRequest');

  const bernardDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Bernard);
  const charlesDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Charles);

  // See the personas in the history page
  await expect(bernardDetailsLink).toBeVisible();
  await expect(charlesDetailsLink).toBeVisible();

  // Let's focus on Bernard
  await bernardDetailsLink.click();

  await new FeedbackHistoryDetailsPage(page).matchPending('sentRequest', Persona.Bernard, feedbackDetails.message);

  await new UserMenuPage(page).logout();

  // ====== Bernard replies to Alfred request ======

  await new SignInPage(page).gotoAndSignIn(Persona.Bernard);

  const bernardHistoryPage = new FeedbackHistoryPage(page);
  await bernardHistoryPage.goto('receivedRequest');

  const alfredDetailsLink = await bernardHistoryPage.findDetailsLink(Persona.Alfred);
  await expect(alfredDetailsLink).toBeVisible();
  await alfredDetailsLink.click();

  await new FeedbackHistoryDetailsPage(page).matchPending('receivedRequest', Persona.Alfred, feedbackDetails.message);

  await page.getByRole('button', { name: 'Répondre', exact: true }).click();

  await new GiveRequestedFeedbackPage(page).give(Persona.Alfred, feedbackDetails);

  // See the persona in the success page
  await expect(page.getByText(Persona.Alfred)).toBeVisible();
  await page.getByRole('button', { name: 'Consulter le feedZback' }).click();

  await new FeedbackHistoryDetailsPage(page).matchDone('given', Persona.Alfred, feedbackDetails);

  await new UserMenuPage(page).logout();

  // ====== Alfred has received feedback from Bernard ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  const alfredHistoryPage2 = new FeedbackHistoryPage(page);
  await alfredHistoryPage2.goto('received');

  const bernardDetailsLink2 = await alfredHistoryPage2.findDetailsLink(Persona.Bernard);
  await expect(bernardDetailsLink2).toBeVisible();
  await bernardDetailsLink2.click();

  await new FeedbackHistoryDetailsPage(page).matchDone('received', Persona.Bernard, feedbackDetails);

  // ====== Alfred sets Daniel as its manager ======

  await new SettingsPage(page).gotoAndSetManager(Persona.Daniel);
  await new UserMenuPage(page).logout();

  // ====== Daniel can now view the feedbacks that Alfred has shared with him ======

  await new SignInPage(page).gotoAndSignIn(Persona.Daniel);

  await expect(page.getByRole('link', { name: 'Manager' })).toBeVisible();

  const managerPage = new ManagerPage(page);
  managerPage.goto();
  managerPage.selectManaged(Persona.Alfred);

  // View the feedback sent by Bernard
  const bernardDetailsLink3 = await managerPage.findGiverDetailsLink(Persona.Bernard);
  await expect(bernardDetailsLink3).toBeVisible();
  await bernardDetailsLink3.click();
  await managerPage.matchDoneFeedback(Persona.Bernard, Persona.Alfred, feedbackDetails);

  // Go back to the list of shared feedbacks
  await page.getByRole('button', { name: 'FeedZbacks partagés' }).click();
  await page.waitForURL('/fr/manager/list/**');

  // View the feedback expected from Charles
  const charlesDetailsLink2 = await managerPage.findGiverDetailsLink(Persona.Charles);
  await expect(charlesDetailsLink2).toBeVisible();
  await charlesDetailsLink2.click();
  await managerPage.matchPendingFeedback(Persona.Charles, Persona.Alfred, feedbackDetails.message);
});
