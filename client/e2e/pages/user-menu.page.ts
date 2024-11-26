import { Page } from '@playwright/test';

export class UserMenuPage {
  constructor(private page: Page) {}

  async logout() {
    await this.page.getByLabel('Menu utilisateur').click();
    await this.page.getByRole('menuitem', { name: 'Se déconnecter' }).click();

    await this.page.waitForURL('/fr/sign-in');
  }
}
