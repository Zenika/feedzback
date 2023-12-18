import { ConsultantData } from './consultant-db.types';

export const isEmptyConsultantData = (consultantData: ConsultantData | null | undefined) => {
  const hasFields: Record<keyof ConsultantData, boolean> = {
    managerEmail: !!consultantData?.managerEmail,
    managedEmails: !!consultantData?.managedEmails && consultantData.managedEmails.length > 0,
  };
  return !Object.values(hasFields).includes(true);
};
