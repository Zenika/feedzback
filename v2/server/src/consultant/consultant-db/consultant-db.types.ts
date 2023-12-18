export type Consultant = {
  [consultantEmail: string]: ConsultantData;
};

export type ConsultantData = {
  managerEmail?: string;
  managedEmails?: string[];
};
