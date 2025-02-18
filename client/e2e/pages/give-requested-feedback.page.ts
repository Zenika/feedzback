import { Page, expect } from '@playwright/test';
import { Persona } from './sign-in.page';

type Details = {
  context: string;
  positive: string;
  negative: string;
  comment: string;
};

export class GiveRequestedFeedbackPage {
  constructor(private page: Page) {}

  async fill(details: Partial<Details>) {
    await this.page.waitForURL('/fr/give-requested/token/**');

    if (details.context !== undefined) {
      await this.page.getByRole('textbox', { name: 'Contexte' }).fill(details.context);
    }

    if (details.positive !== undefined) {
      await this.page.getByRole('textbox', { name: 'Points forts' }).fill(details.positive);
    }

    if (details.negative !== undefined) {
      await this.page.getByRole('textbox', { name: "Axes d'améliorations" }).fill(details.negative);
    }

    if (details.comment !== undefined) {
      await this.page.getByRole('textbox', { name: 'Commentaire' }).fill(details.comment);
    }
  }

  async expect(persona: Persona, details: Partial<Details>) {
    await this.page.waitForURL('/fr/give-requested/token/**');

    await expect(
      this.page.getByRole('textbox', { name: 'Email de votre collègue' }),
      `Feedback receiver should be ${persona ? persona : 'empty'}`,
    ).toHaveValue(persona);

    if (details.context !== undefined) {
      await expect(
        this.page.getByRole('textbox', { name: 'Contexte' }),
        'Feedback "context" should be visible',
      ).toHaveValue(details.context);
    }

    if (details.positive !== undefined) {
      await expect(
        this.page.getByRole('textbox', { name: 'Points forts' }),
        'Feedback "positive" should be visible',
      ).toHaveValue(details.positive);
    }

    if (details.negative !== undefined) {
      await expect(
        this.page.getByRole('textbox', { name: "Axes d'améliorations" }),
        'Feedback "negative" should be visible',
      ).toHaveValue(details.negative);
    }

    if (details.comment !== undefined) {
      await expect(
        this.page.getByRole('textbox', { name: 'Commentaire' }),
        'Feedback "comment" should be visible',
      ).toHaveValue(details.comment);
    }
  }

  async save() {
    await this.page.getByRole('button', { name: 'Sauvegarder' }).click();
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Envoyer' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.waitForURL('/fr/give-requested/success');
  }

  async fillAndSubmit(details: Details) {
    await this.fill(details);
    await this.submit();
  }
}
