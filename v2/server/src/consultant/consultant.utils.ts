import { ConsultantData } from './consultant-db/consultant-db.types';

export const buildRequiredConsultantData = (
  consultantData: ConsultantData | null | undefined,
): Required<ConsultantData> => ({
  managerEmail: '',
  managedEmails: [],
  ...consultantData,
});
