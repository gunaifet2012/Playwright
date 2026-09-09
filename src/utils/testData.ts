export interface EmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export function buildEmployee(overrides: Partial<EmployeeData> = {}): EmployeeData {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-8);
  return {
    firstName: `Auto${suffix.slice(0, 4)}`,
    middleName: 'QA',
    lastName: `User${suffix.slice(4)}`,
    ...overrides
  };
}
