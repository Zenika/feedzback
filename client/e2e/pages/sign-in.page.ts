import { Page } from '@playwright/test';

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/fr/sign-in');
  }

  async signIn(persona: Persona) {
    await this.page.getByRole('button', { name: 'Se connecter avec identifiants' }).click();
    await this.page.getByLabel('Email').fill(persona);
    await this.page.getByLabel('Mot de passe').fill('zenika');
    await this.page.getByRole('button', { name: 'Se connecter' }).click();

    await this.page.waitForURL('/fr/home');
  }

  async gotoAndSignIn(persona: Persona) {
    await this.goto();
    await this.signIn(persona);
  }
}

export const Persona = {
  Alfred: 'alfred.demo@zenika.com',
  Bernard: 'bernard.demo@zenika.com',
  Charles: 'charles.demo@zenika.com',
  Daniel: 'daniel.demo@zenika.com',
} as const;

export type Persona = (typeof Persona)[keyof typeof Persona];
