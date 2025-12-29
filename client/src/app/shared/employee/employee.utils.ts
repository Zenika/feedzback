import { EmployeeData } from './employee.types';

export const updateEmployeeData = (oldData?: EmployeeData | null, newData?: Partial<EmployeeData>): EmployeeData => ({
  ...(oldData ?? { managerEmail: '', managedEmails: [] }),
  ...newData,
});

export const isManager = (employeeData?: EmployeeData | null) => !!employeeData?.managedEmails.length;
