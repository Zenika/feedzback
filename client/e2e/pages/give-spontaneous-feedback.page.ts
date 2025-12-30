import { Page, expect } from '@playwright/test';
import { Persona } from './sign-in.page';

type Details = {
  context: string;
  positive: string;
  negative: string;
  comment: string;
};

export class GiveSpontaneousFeedbackPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/give');

    await this.page.waitForURL('/fr/give');
  }

  async fill(persona: Persona | '' | undefined, details: Partial<Details>) {
    if (persona !== undefined) {
      await this.page.getByRole('combobox', { name: 'Email de votre collègue' }).fill(persona);
    }

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

  async expect(persona: Persona | '' | undefined, details: Partial<Details>) {
    if (persona !== undefined) {
      await expect(
        this.page.getByRole('combobox', { name: 'Email de votre collègue' }),
        `Feedback receiver should be ${persona ? persona : 'empty'}`,
      ).toHaveValue(persona);
    }

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

  async submit() {
    await this.page.getByRole('button', { name: 'Envoyer' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.waitForURL('/fr/give/success');
  }

  async gotoFillAndSubmit(persona: Persona, details: Details) {
    await this.goto();
    await this.fill(persona, details);
    await this.submit();
  }

  // ----- draft -----

  async saveAsDraft() {
    await this.page.getByRole('button', { name: 'Sauvegarder' }).click();

    // IMPORTANT
    // ---------
    // We must wait until the notification appears because the localStorage is not cleared until the draft is fully saved.
    //
    // For more info, see:
    //  -> File: src/app/give-feedback/give-feedback/give-feedback.component.ts
    //    -> Method: onDraft()
    //      -> Statement: this.unsavedFormService.markAsPristineAndDeleteStoredValue() // This is where the localStorage is cleared!
    //
    await expect(this.page.getByText('Brouillon sauvegardé.'), 'Draft saved notification should appear').toBeVisible();
  }

  async applyDraft(persona: Persona) {
    await this.draftHandler(persona, 'edit');
  }

  async deleteDraft(persona: Persona) {
    await this.draftHandler(persona, 'delete');
  }

  private async draftHandler(persona: Persona, action: 'edit' | 'delete') {
    await this.page.getByRole('button', { name: 'Brouillons' }).click();

    // Wait until the the `<table>` is rendered
    await this.page.locator('tbody').waitFor();

    await this.page
      .locator('tbody > tr', { has: this.page.getByRole('cell', { name: persona }) })
      .getByRole('button')
      .filter({ hasText: action })
      .click();
  }
}
