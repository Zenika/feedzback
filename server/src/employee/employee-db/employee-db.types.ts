export type Employee = {
  [employeeEmail: string]: EmployeeData;
};

export type EmployeeData = {
  managerEmail?: string;
  managedEmails?: string[];
};
