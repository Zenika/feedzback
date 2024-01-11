export type EmployeeData = {
  managerEmail: string;
  managedEmails: string[];
};

export type EmployeeSearchResult = {
  email: string;
  displayName: string;
  photoUrl?: string;
};
