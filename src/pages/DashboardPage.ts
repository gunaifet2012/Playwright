import { expect, Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }

  async openPim(): Promise<void> {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await expect(this.page).toHaveURL(/pim/);
  }

  async logout(): Promise<void> {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(this.page).toHaveURL(/auth\/login/);
  }
}
