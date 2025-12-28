export type EmployeeData = {
  managerEmail: string;
  managedEmails: string[];
};

export type EmployeeManagerEmailSync =
  | { updated: false; managerEmail: null | string }
  | { updated: true; managerEmail: string; previousManagerEmail?: string };
