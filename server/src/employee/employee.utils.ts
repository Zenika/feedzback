import { EmployeeData } from './employee-db/employee-db.types';

export const buildRequiredEmployeeData = (employeeData: EmployeeData | null | undefined): Required<EmployeeData> => ({
  managerEmail: '',
  managedEmails: [],
  ...employeeData,
});
