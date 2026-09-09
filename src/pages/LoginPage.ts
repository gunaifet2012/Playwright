import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectLoginFailed(): Promise<void> {
    await expect(this.page.getByText('Invalid credentials')).toBeVisible();
  }
}
