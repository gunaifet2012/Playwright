import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { EmployeeApiService } from '../api/EmployeeApiService';
import { env } from '../utils/env';

type AppFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  employeeApi: EmployeeApiService;
  authenticatedPage: void;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  pimPage: async ({ page }, use) => use(new PimPage(page)),
  employeeApi: async ({ page }, use) => use(new EmployeeApiService(page.request)),

  authenticatedPage: [async ({ loginPage, dashboardPage }, use) => {
    await loginPage.goto();
    await loginPage.login(env.adminUsername, env.adminPassword);
    await dashboardPage.expectLoaded();
    await use();
  }, { auto: false }]
});

export { expect };
