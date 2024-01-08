export type Employee = {
  [employeeEmail: string]: EmployeeData;
};

export type EmployeeData = {
  managerEmail?: string;
  managedEmails?: string[];
};

export interface EmployeeSearchResult {
  email : string
  displayName : string;
  photoUrl?:string
}

export type EmployeeSearchResultList = EmployeeSearchResult[]