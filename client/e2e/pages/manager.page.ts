import { Page, expect } from '@playwright/test';
import { Persona } from './sign-in.page';

type Details = {
  message?: string; // note: there's no message for spontaneous feedback
  positive: string;
  negative: string;
  comment: string;
};

export class ManagerPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/manager');
  }

  async selectManaged(persona: Persona) {
    await this.page.getByLabel('Collaborateur').click();
    await this.page.getByRole('option', { name: persona }).click();
  }

  async findGiverDetailsLink(persona: Persona) {
    // Wait until the the `<table>` is rendered
    await this.page.locator('tbody').waitFor();

    return this.page
      .locator('tbody > tr', { has: this.page.getByRole('cell', { name: persona }) })
      .getByLabel('Consulter'); // note: the label can be 'Consulter la demande' or 'Consulter le feedZback'
  }

  async matchPendingFeedback(giver: Persona, receiver: Persona, message: string) {
    await this.page.waitForURL('/fr/manager/document/**');

    await expect(this.page.getByRole('heading', { name: 'Demande de feedZback partagé' })).toBeVisible();

    await expect(this.page.getByText(giver)).toBeVisible();
    await expect(this.page.getByText(receiver)).toBeVisible();

    if (message) {
      await expect(this.page.getByText(message)).toBeVisible();
    }
  }

  async matchDoneFeedback(giver: Persona, receiver: Persona, details: Details) {
    await this.page.waitForURL('/fr/manager/document/**');

    await expect(this.page.getByRole('heading', { name: 'FeedZback partagé' })).toBeVisible();

    await expect(this.page.getByText(giver)).toBeVisible();
    await expect(this.page.getByText(receiver)).toBeVisible();

    if (details.message) {
      await expect(this.page.getByText(details.message)).toBeVisible();
    }
    await expect(this.page.getByText(details.positive)).toBeVisible();
    await expect(this.page.getByText(details.negative)).toBeVisible();
    await expect(this.page.getByText(details.comment)).toBeVisible();
  }
}
