import { test, expect } from '../src/fixtures/testFixtures';
import { env } from '../src/utils/env';

test.describe('Authentication', () => {
  test('@smoke admin can login and logout', async ({ loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.login(env.adminUsername, env.adminPassword);
    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
  });

  test('@regression invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid-user', 'invalid-password');
    await loginPage.expectLoginFailed();
    await expect(loginPage).toBeTruthy();
  });
});
