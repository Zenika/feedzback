import { Page } from '@playwright/test';
import { Persona } from './sign-in.page';

export class RequestFeedbackPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/request');
  }

  async request(personas: Persona[], message = '') {
    const emailsField = this.page.getByText('Emails de vos collègues');
    await emailsField.fill(personas.join(', '));
    await emailsField.press('Tab');

    if (message) {
      await this.page.getByRole('textbox', { name: 'Message' }).fill(message);
    }

    await this.page.getByRole('button', { name: 'Envoyer' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.waitForURL('/fr/request/success');
  }

  async gotoAndRequest(personas: Persona[], message = '') {
    await this.goto();
    await this.request(personas, message);
  }
}
