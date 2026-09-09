import { APIRequestContext, expect } from '@playwright/test';

export class EmployeeApiService {
  constructor(private readonly request: APIRequestContext) {}

  async getEmployee(employeeId: string): Promise<Record<string, unknown>> {
    const response = await this.request.get(`/web/index.php/api/v2/pim/employees/${employeeId}`);
    expect(response.ok(), `GET employee ${employeeId} failed: ${response.status()}`).toBeTruthy();
    return response.json();
  }

  async expectEmployeeDeleted(employeeId: string): Promise<void> {
    const response = await this.request.get(`/web/index.php/api/v2/pim/employees/${employeeId}`);
    expect([404, 422]).toContain(response.status());
  }
}
