import { test, expect } from '../src/fixtures/testFixtures';
import { env } from '../src/utils/env';

test.describe('Role-based access validation', () => {
  test('@regression admin can access PIM', async ({ authenticatedPage: _authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.openPim();
    await expect(page).toHaveURL(/pim/);
  });

  test('@regression restricted user cannot access admin-only areas', async ({ loginPage, page }) => {
    test.skip(!env.restrictedUsername || !env.restrictedPassword,
      'Configure RESTRICTED_USERNAME and RESTRICTED_PASSWORD to execute real negative RBAC validation.');

    await loginPage.goto();
    await loginPage.login(env.restrictedUsername!, env.restrictedPassword!);
    await expect(page).toHaveURL(/dashboard/);

    await page.goto('/web/index.php/admin/viewSystemUsers');
    await expect(page).not.toHaveURL(/admin\/viewSystemUsers$/);
  });
});
