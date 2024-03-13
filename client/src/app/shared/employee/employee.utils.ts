import { EmployeeData } from './employee.types';

export const updateEmployeeData = (oldData?: EmployeeData, newData?: Partial<EmployeeData>): EmployeeData => ({
  ...(oldData ?? { managerEmail: '', managedEmails: [] }),
  ...newData,
});

export const isManager = ({ managedEmails }: EmployeeData) => managedEmails.length > 0;
