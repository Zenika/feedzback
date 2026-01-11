import { expect, Page } from '@playwright/test';

export class PreRequestFeedbackTokenPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/request');

    await this.page.getByRole('radio', { name: 'Avec un lien magique' }).check();
    await expect(this.page.getByText('Emails de vos collègues')).toBeDisabled();
  }

  async generate(message = '') {
    if (message) {
      await this.page.getByRole('textbox', { name: 'Message' }).fill(message);
    }
    await this.page.getByRole('button', { name: 'Générer' }).click();

    await this.page.waitForURL('/fr/request/success');
  }

  async getMagicLink(): Promise<string> {
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await this.page.getByRole('button', { name: 'Lien magique' }).click();

    await expect(this.page.getByText('Copié dans le presse-papier !')).toBeVisible();

    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  async gotoGenerateAndGetMagicLink(message = ''): Promise<string> {
    await this.goto();
    await this.generate(message);
    return await this.getMagicLink();
  }
}
