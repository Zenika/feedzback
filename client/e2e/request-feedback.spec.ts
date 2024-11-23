import { expect, test } from '@playwright/test';
import { FeedbackHistoryPage } from './pages/feedback-history.page';
import { FirestorePage } from './pages/firestore.page';
import { RequestFeedbackPage } from './pages/request-feedback.page';
import { Persona, SignInPage } from './pages/sign-in.page';
import { UserMenuPartial } from './partials/user-menu.partial';

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Request feedback', async ({ page }) => {
  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  await new RequestFeedbackPage(page).gotoAndRequest([Persona.Bernard, Persona.Claude], 'Quel est votre feedback ?');

  // See the personas in the success page
  await page.getByText(Persona.Bernard).waitFor();
  await page.getByText(Persona.Claude).waitFor();

  const alfredHistoryPage = new FeedbackHistoryPage(page);
  await alfredHistoryPage.goto('sentRequest');
  const [bernardDetailsLink] = await alfredHistoryPage.findAll(Persona.Bernard);
  const [claudeDetailsLink] = await alfredHistoryPage.findAll(Persona.Claude);

  expect(bernardDetailsLink).toBeDefined();
  expect(claudeDetailsLink).toBeDefined();

  await bernardDetailsLink();
  await page.getByText(Persona.Bernard).waitFor();
  await page.getByText('Quel est votre feedback ?').waitFor();

  await new UserMenuPartial(page).logout();

  await new SignInPage(page).gotoAndSignIn(Persona.Bernard);

  const bernardHistoryPage = new FeedbackHistoryPage(page);
  await bernardHistoryPage.goto('receivedRequest');
  const [alfredDetailsLink] = await bernardHistoryPage.findAll(Persona.Alfred);

  expect(alfredDetailsLink).toBeDefined();
  await alfredDetailsLink();
  await page.getByText(Persona.Alfred).waitFor();
  await page.getByRole('button', { name: 'Répondre', exact: true }).click();

  await page.getByText('Points positifs').fill('Ok');
  await page.getByText("Axes d'améliorations").fill('Ko');
  await page.getByText('Commentaire').fill('R.A.S');

  await page.getByRole('button', { name: 'Envoyer' }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  await page.waitForURL('/fr/give-requested/success');
});
