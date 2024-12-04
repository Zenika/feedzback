import { Page } from '@playwright/test';
import { Persona } from './sign-in.page';

type Details = {
  positive: string;
  negative: string;
  comment: string;
};

export class GiveSpontaneousFeedbackPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(`/fr/give`);
  }

  async give(persona: Persona, details: Details) {
    await this.page.getByLabel('Email de votre collègue').fill(persona);

    await this.page.getByText('Points forts').fill(details.positive);
    await this.page.getByText("Axes d'améliorations").fill(details.negative);
    await this.page.getByText('Commentaire').fill(details.comment);

    await this.page.getByRole('button', { name: 'Envoyer' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.waitForURL('/fr/give/success');
  }

  async gotoAndGive(persona: Persona, details: Details) {
    await this.goto();
    await this.give(persona, details);
  }
}
