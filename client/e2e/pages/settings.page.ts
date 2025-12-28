import { expect, Page } from '@playwright/test';
import { Persona } from './sign-in.page';

// NOTE: Only `Persona.Alfred` has a defined manager, which is: `Persona.Daniel`.
// For details, see:
//  - '../../server/src/core/google-apis/google-apis.service.stub'

export class SettingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/settings');
  }

  async checkManager(persona: Persona | null) {
    if (persona) {
      await expect(this.page.getByText(persona), `Manager email properly defined "${persona}"`).toBeVisible();
    } else {
      await expect(this.page.getByText("Votre manager n'est pas défini dans FeedZback.")).toBeVisible();
    }
  }

  async gotoAndCheckManager(persona: Persona | null) {
    await this.goto();
    await this.checkManager(persona);
  }
}
