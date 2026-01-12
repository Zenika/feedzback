import { expect, Page } from '@playwright/test';

export class PreRequestFeedbackTokenPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/request');
  }

  // ----- Generate new magic link -----

  async generate(message = '') {
    await this.page.getByRole('radio', { name: 'Avec un lien magique' }).check();
    await expect(this.page.getByText('Emails de vos collègues')).toBeDisabled();

    if (message) {
      await this.page.getByRole('textbox', { name: 'Message' }).fill(message);
    }
    await this.page.getByRole('button', { name: 'Générer' }).click();

    await this.page.waitForURL('/fr/request/success');
  }

  async getMagicLinkFromFromSuccess(): Promise<string> {
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await this.page.getByRole('button', { name: 'Lien magique' }).click();

    await expect(this.page.getByText('Copié dans le presse-papier !')).toBeVisible();

    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  async gotoGenerateAndGetMagicLinkFromSuccess(message = ''): Promise<string> {
    await this.goto();
    await this.generate(message);
    return await this.getMagicLinkFromFromSuccess();
  }

  // ----- Check existing magic link -----

  async checkMagicLinkFromDialog(rowIndex: number) {
    await this.page.getByRole('button', { name: 'Liens magiques' }).click();

    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await this.page.getByRole('button').filter({ hasText: 'content_copy' }).nth(rowIndex).click();

    await this.page.getByRole('button', { name: 'Fermer' }).click();

    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  async gotoAndCheckMagicLinkFromDialog(rowIndex: number): Promise<string> {
    await this.goto();
    return await this.checkMagicLinkFromDialog(rowIndex);
  }
}
