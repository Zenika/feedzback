import { Page, expect } from '@playwright/test';
import { Persona } from './sign-in.page';

type Details = {
  message?: string; // note: there's no message for spontaneous feedback
  positive: string;
  negative: string;
  comment: string;
};

export class FeedbackHistoryDetailsPage {
  private headingMap = {
    received: 'FeedZback reçu',
    given: 'FeedZback donné',
    sentRequest: 'FeedZback demandé',
    receivedRequest: 'FeedZback à donner',
  };

  constructor(private page: Page) {}

  async matchPending(type: 'sentRequest' | 'receivedRequest', persona: Persona, message: string) {
    await this.page.waitForURL('/fr/history/id/**');

    await expect(this.page.getByRole('heading', { name: this.headingMap[type] })).toBeVisible();

    await expect(this.page.getByText(persona)).toBeVisible();

    await expect(this.page.getByText(message)).toBeVisible();
  }

  async matchDone(type: 'received' | 'given', persona: Persona, details: Details) {
    await this.page.waitForURL('/fr/history/id/**');

    await expect(this.page.getByRole('heading', { name: this.headingMap[type] })).toBeVisible();

    await expect(this.page.getByText(persona)).toBeVisible();

    if (details.message) {
      await expect(this.page.getByText(details.message)).toBeVisible();
    }
    await expect(this.page.getByText(details.positive)).toBeVisible();
    await expect(this.page.getByText(details.negative)).toBeVisible();
    await expect(this.page.getByText(details.comment)).toBeVisible();
  }
}
