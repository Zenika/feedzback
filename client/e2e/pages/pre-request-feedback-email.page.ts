import { expect, Page } from '@playwright/test';
import { Persona } from './sign-in.page';

export class PreRequestFeedbackEmailPage {
  constructor(private page: Page) {}

  async goto(magicLink: string) {
    expect(magicLink).toMatch(/\/fr\/pre-request\/token\//);

    await this.page.goto(magicLink);
  }

  async checkDetails(receiverEmail: Persona, message?: string) {
    await expect(this.page.getByText(receiverEmail)).toBeVisible();

    if (message) {
      await expect(this.page.getByText(message)).toBeVisible();
    }
  }

  async submitEmail(giverEmail: Persona) {
    await this.page.getByRole('textbox', { name: 'Votre email' }).fill(giverEmail);
    await this.page.getByRole('button', { name: 'Valider' }).click();

    await this.page.waitForURL('/fr/pre-request/success');
    await expect(this.page.getByText(giverEmail)).toBeVisible();
  }
}
