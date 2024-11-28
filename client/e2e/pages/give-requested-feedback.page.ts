import { Page, expect } from '@playwright/test';
import { Persona } from './sign-in.page';

type Details = {
  message: string;
  positive: string;
  negative: string;
  comment: string;
};

export class GiveRequestedFeedbackPage {
  constructor(private page: Page) {}

  async give(persona: Persona, details: Details) {
    await this.page.waitForURL('/fr/give-requested/token/**');

    await expect(
      this.page.getByLabel('Email de votre collègue'),
      'Feedback receiver should be filled in correctly',
    ).toHaveValue(persona);

    await this.page.getByText('Points positifs').fill(details.positive);
    await this.page.getByText("Axes d'améliorations").fill(details.negative);
    await this.page.getByText('Commentaire').fill(details.comment);

    await this.page.getByRole('button', { name: 'Envoyer' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.waitForURL('/fr/give-requested/success');
  }
}
