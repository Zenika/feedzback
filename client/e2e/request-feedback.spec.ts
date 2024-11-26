import { expect, test } from '@playwright/test';
import { FeedbackHistoryPage } from './pages/feedback-history.page';
import { FirestorePage } from './pages/firestore.page';
import { RequestFeedbackPage } from './pages/request-feedback.page';
import { Persona, SignInPage } from './pages/sign-in.page';
import { UserMenuPartial } from './partials/user-menu.partial';

test.beforeEach(({ page }) => new FirestorePage(page).reset());

test('Request feedback', async ({ page }) => {
  // ====== Alfred request feedback from Bernard and Charles ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  await new RequestFeedbackPage(page).gotoAndRequest([Persona.Bernard, Persona.Charles], 'Quel est votre feedback ?');

  // See the personas in the success page
  await expect(page.getByText(Persona.Bernard)).toBeVisible();
  await expect(page.getByText(Persona.Charles)).toBeVisible();

  const alfredHistoryPage = new FeedbackHistoryPage(page);
  await alfredHistoryPage.goto('sentRequest');

  const bernardDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Bernard);
  const charlesDetailsLink = await alfredHistoryPage.findDetailsLink(Persona.Charles);

  await expect(bernardDetailsLink).toBeVisible();
  await expect(charlesDetailsLink).toBeVisible();

  await bernardDetailsLink.click();
  await page.waitForURL('/fr/history/id/**');

  await expect(page.getByRole('heading', { name: 'FeedZback demandé' })).toBeVisible();
  await expect(page.getByText(Persona.Bernard)).toBeVisible();
  await expect(page.getByText('Quel est votre feedback ?')).toBeVisible();

  await new UserMenuPartial(page).logout();

  // ====== Bernard replies to Alfred ======

  await new SignInPage(page).gotoAndSignIn(Persona.Bernard);

  const bernardHistoryPage = new FeedbackHistoryPage(page);
  await bernardHistoryPage.goto('receivedRequest');

  const alfredDetailsLink = await bernardHistoryPage.findDetailsLink(Persona.Alfred);
  await expect(alfredDetailsLink).toBeVisible();
  await alfredDetailsLink.click();

  await page.waitForURL('/fr/history/id/**');
  await expect(page.getByRole('heading', { name: 'FeedZback à donner' })).toBeVisible();
  await expect(page.getByText(Persona.Alfred)).toBeVisible();
  await expect(page.getByText('Quel est votre feedback ?')).toBeVisible();
  await page.getByRole('button', { name: 'Répondre', exact: true }).click();

  await page.getByText('Points positifs').fill('Ok');
  await page.getByText("Axes d'améliorations").fill('Ko');
  await page.getByText('Commentaire').fill('R.A.S');

  await page.getByRole('button', { name: 'Envoyer' }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  await page.waitForURL('/fr/give-requested/success');
  await expect(page.getByText(Persona.Alfred)).toBeVisible();
  await page.getByRole('button', { name: 'Consulter le feedZback' }).click();

  await page.waitForURL('/fr/history/id/**');
  await expect(page.getByRole('heading', { name: 'FeedZback donné' })).toBeVisible();
  await expect(page.getByText('Quel est votre feedback ?')).toBeVisible();
  await expect(page.getByText('Ok')).toBeVisible();
  await expect(page.getByText('Ko')).toBeVisible();
  await expect(page.getByText('R.A.S')).toBeVisible();

  await new UserMenuPartial(page).logout();

  // ====== Alfred has received feedback from Bernard ======

  await new SignInPage(page).gotoAndSignIn(Persona.Alfred);

  const alfredHistoryPage2 = new FeedbackHistoryPage(page);
  await alfredHistoryPage2.goto('received');

  const bernardDetailsLink2 = await alfredHistoryPage2.findDetailsLink(Persona.Bernard);
  await expect(bernardDetailsLink2).toBeVisible();
  await bernardDetailsLink2.click();

  await page.waitForURL('/fr/history/id/**');
  await expect(page.getByRole('heading', { name: 'FeedZback reçu' })).toBeVisible();
  await expect(page.getByText('Quel est votre feedback ?')).toBeVisible();
  await expect(page.getByText('Ok')).toBeVisible();
  await expect(page.getByText('Ko')).toBeVisible();
  await expect(page.getByText('R.A.S')).toBeVisible();
});
