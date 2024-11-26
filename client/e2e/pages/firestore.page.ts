import { Page } from '@playwright/test';

export class FirestorePage {
  constructor(private page: Page) {}

  async reset() {
    await this.page.goto('http://localhost:4000/firestore/default/data');
    await this.page.getByRole('button', { name: 'Clear all data' }).click();
    await this.page.getByRole('button', { name: 'Clear', exact: true }).click();
  }
}
