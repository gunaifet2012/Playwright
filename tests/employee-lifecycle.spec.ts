import { test, expect } from '../src/fixtures/testFixtures';
import { buildEmployee } from '../src/utils/testData';

test.describe('Employee lifecycle', () => {
  test('@smoke @regression create, verify, update and delete employee', async ({
    authenticatedPage: _authenticatedPage,
    dashboardPage,
    pimPage,
    employeeApi
  }) => {
    const employee = buildEmployee();
    const updatedFirstName = `${employee.firstName}Upd`;

    await test.step('Create employee through UI', async () => {
      await dashboardPage.openPim();
    });

    const employeeId = await test.step('Capture employee identifier', async () => pimPage.addEmployee(employee));

    await test.step('Verify employee through API using authenticated browser context', async () => {
      const payload = await employeeApi.getEmployee(employeeId);
      expect(JSON.stringify(payload)).toContain(employee.firstName);
      expect(JSON.stringify(payload)).toContain(employee.lastName);
    });

    await test.step('Update employee through UI', async () => {
      await pimPage.updateFirstName(updatedFirstName);
    });

    await test.step('Verify updated employee appears in employee list', async () => {
      await dashboardPage.openPim();
      await pimPage.searchByEmployeeId(employeeId);
      await pimPage.expectEmployeeInResults(employeeId);
    });

    await test.step('Delete employee as cleanup', async () => {
      await pimPage.deleteEmployeeFromResults(employeeId);
      await pimPage.searchByEmployeeId(employeeId);
      await pimPage.expectNoEmployeeResults();
    });
  });
});
