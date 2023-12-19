import { EmployeeData } from './employee-db.types';

export const isEmptyEmployeeData = (employeeData: EmployeeData | null | undefined) => {
  const hasFields: Record<keyof EmployeeData, boolean> = {
    managerEmail: !!employeeData?.managerEmail,
    managedEmails: !!employeeData?.managedEmails && employeeData.managedEmails.length > 0,
  };
  return !Object.values(hasFields).includes(true);
};
