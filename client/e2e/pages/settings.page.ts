import { Page } from '@playwright/test';
import { Persona } from './sign-in.page';

export class SettingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/settings');
  }

  async setManager(persona: Persona) {
    await this.page.getByLabel('Email de votre manager').fill(persona);
    await this.page.getByRole('button', { name: 'Mettre à jour' }).click();
  }

  async gotoAndSetManager(persona: Persona) {
    await this.goto();
    await this.setManager(persona);
  }
}
