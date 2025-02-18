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

const feedbackMessage = 'Quel est votre feedback ?';

const feedbackDetails = {
  context: 'On a travaillé ensemble',
  positive: 'Ok',
  negative: 'Ko',
  comment: 'R.A.S',
} as const;

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Submit requested feedback', async ({ page }) => {
  // ====== Alfred request feedback from Bernard and Charles ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  await new RequestFeedbackPage(page).gotoAndRequest([Persona.Bernard, Persona.Charles], feedbackMessage);

  await expect(page.getByText(Persona.Bernard), 'Recipient should be visible in the success page').toBeVisible();
  await expect(page.getByText(Persona.Charles), 'Recipient should be visible in the success page').toBeVisible();

  const alfredHistoryPage = new FeedbackHistoryPage(page);
  await alfredHistoryPage.goto('sentRequest');

  const bernardDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Bernard);
  const charlesDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Charles);

  // See the personas in the history page
  await expect(bernardDetailsLink, 'Expected giver should be visible in the history page').toBeVisible();
  await expect(charlesDetailsLink, 'Expected giver should be visible in the history page').toBeVisible();

  // Let's focus on Bernard
  await bernardDetailsLink.click();

  await new FeedbackHistoryDetailsPage(page).matchPending('sentRequest', Persona.Bernard, feedbackMessage);

  await new UserMenuPage(page).signOut();

  // ====== Bernard replies to Alfred's request ======

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

  await page.getByRole('button', { name: 'Répondre', exact: true }).click();

  const feedbackPage = new GiveRequestedFeedbackPage(page);
  await feedbackPage.expect(Persona.Alfred, {});
  await feedbackPage.fillAndSubmit(feedbackDetails);

  await expect(page.getByText(Persona.Alfred), 'Feedback receiver should be visible in the success page').toBeVisible();
  await page.getByRole('button', { name: 'Consulter le feedZback' }).click();

  await new FeedbackHistoryDetailsPage(page).matchDone('given', Persona.Alfred, feedbackDetails);

  await new UserMenuPage(page).signOut();

  // ====== Alfred has received feedback from Bernard ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  const alfredHistoryPage2 = new FeedbackHistoryPage(page);
  await alfredHistoryPage2.goto('received');

  const bernardDetailsLink2 = await alfredHistoryPage2.findDetailsLink(Persona.Bernard);
  await expect(bernardDetailsLink2, 'Feedback giver should be visible in the history page').toBeVisible();
  await bernardDetailsLink2.click();

  await new FeedbackHistoryDetailsPage(page).matchDone('received', Persona.Bernard, feedbackDetails);

  // ====== Alfred sets Daniel as its manager ======

  await new SettingsPage(page).gotoAndSetManager(Persona.Daniel);
  await new UserMenuPage(page).signOut();

  // ====== Daniel can now view the feedbacks that Alfred has shared with him ======

  await new SignInPage(page).gotoAndSignIn(Persona.Daniel);

  await expect(page.getByRole('link', { name: 'Manager' }), 'Manager link should be visible').toBeVisible();

  const managerPage = new ManagerPage(page);
  managerPage.goto();
  managerPage.selectManaged(Persona.Alfred);

  // View the feedback sent by Bernard
  const bernardDetailsLink3 = await managerPage.findGiverDetailsLink(Persona.Bernard);
  await expect(bernardDetailsLink3, 'Shared feedback (done) link should be visible').toBeVisible();
  await bernardDetailsLink3.click();
  await managerPage.matchDoneFeedback(Persona.Bernard, Persona.Alfred, feedbackDetails);

  // Go back to the list of shared feedbacks
  await page.getByRole('button', { name: 'Liste des feedZbacks partagés' }).click();
  await page.waitForURL('/fr/manager/list/**');

  // View the feedback expected from Charles
  const charlesDetailsLink2 = await managerPage.findGiverDetailsLink(Persona.Charles);
  await expect(charlesDetailsLink2, 'Shared feedback (pending) link should be visible').toBeVisible();
  await charlesDetailsLink2.click();
  await managerPage.matchPendingFeedback(Persona.Charles, Persona.Alfred, feedbackMessage);
});
