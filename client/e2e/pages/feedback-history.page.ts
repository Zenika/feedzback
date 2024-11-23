import { Page } from '@playwright/test';
import { Persona } from './sign-in.page';

export class FeedbackHistoryPage {
  constructor(private page: Page) {}

  async goto(type: 'received' | 'given' | 'sentRequest' | 'receivedRequest') {
    if (type === 'receivedRequest') {
      await this.page.goto(`/fr/give-requested`);
    } else {
      await this.page.goto(`/fr/history/type/${type}`);
    }
  }

  async findAll(persona: Persona) {
    await this.page.locator('tbody').waitFor();

    const rows = await this.page.locator('tbody > tr').all();

    const detailsLinks: (() => Promise<void>)[] = [];

    for (const row of rows) {
      const matchPersona = (await row.getByRole('cell', { name: persona }).count()) === 1;
      if (!matchPersona) {
        continue;
      }
      detailsLinks.push(() => row.getByLabel('Consulter').click());
    }

    return detailsLinks;
  }
}

// TODO: il manque le bouton répondre avec : row.getByLabel('Répondre').click()
