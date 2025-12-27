export type EmployeeData = {
  managerEmail: string;
  managedEmails: string[];
};

export type EmployeeManagerEmailSync = {
  managerEmail: string | null;
  previousManagerEmail?: string;
  updated?: boolean;
};
