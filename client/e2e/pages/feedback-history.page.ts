import { Page } from '@playwright/test';
import { Persona } from './sign-in.page';

export class FeedbackHistoryPage {
  constructor(private page: Page) {}

  async goto(type: 'received' | 'given' | 'sentRequest' | 'receivedRequest') {
    if (type === 'receivedRequest') {
      // Dedicated page to list the received requests
      await this.page.goto(`/fr/give-requested`);
    } else {
      await this.page.goto(`/fr/history/type/${type}`);
    }
  }

  async findDetailsLink(persona: Persona) {
    // Wait until the the `<table>` is rendered
    await this.page.locator('tbody').waitFor();

    return this.page
      .locator('tbody > tr', { has: this.page.getByRole('cell', { name: persona }) })
      .getByLabel('Consulter');
  }
}
