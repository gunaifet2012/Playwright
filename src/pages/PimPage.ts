import { expect, Page } from '@playwright/test';
import type { EmployeeData } from '../utils/testData';

export class PimPage {
  constructor(private readonly page: Page) {}

  async addEmployee(employee: EmployeeData): Promise<string> {
    await this.page.getByRole('link', { name: 'Add Employee' }).click();
    await expect(this.page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

    await this.page.getByPlaceholder('First Name').fill(employee.firstName);
    if (employee.middleName) await this.page.getByPlaceholder('Middle Name').fill(employee.middleName);
    await this.page.getByPlaceholder('Last Name').fill(employee.lastName);
    await this.page.getByRole('button', { name: 'Save' }).click();

    await expect(this.page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/);
    const match = this.page.url().match(/empNumber\/(\d+)/);
    if (!match) throw new Error(`Could not extract employee number from URL: ${this.page.url()}`);
    return match[1];
  }

  async updateFirstName(firstName: string): Promise<void> {
    const input = this.page.getByPlaceholder('First Name');
    await input.fill(firstName);
    await this.page.locator('form').filter({ hasText: 'Personal Details' }).getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText('Successfully Updated')).toBeVisible();
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.page.getByRole('link', { name: 'Employee List' }).click();
    const employeeIdInput = this.page.locator('label').filter({ hasText: /^Employee Id$/ }).locator('..').locator('..').getByRole('textbox');
    await employeeIdInput.fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  async expectEmployeeInResults(employeeId: string): Promise<void> {
    await expect(this.page.locator('.oxd-table-card')).toContainText(employeeId);
  }

  async deleteEmployeeFromResults(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    const row = this.page.locator('.oxd-table-card').filter({ hasText: employeeId });
    await expect(row).toBeVisible();
    await row.locator('button').filter({ has: this.page.locator('i.bi-trash') }).click();
    await this.page.getByRole('button', { name: /Yes, Delete/i }).click();
    await expect(this.page.getByText('Successfully Deleted')).toBeVisible();
  }

  async expectNoEmployeeResults(): Promise<void> {
    await expect(this.page.getByText(/No Records Found/i)).toBeVisible();
  }
}
