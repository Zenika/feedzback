import { ConfirmBeforeSubmitData, ConfirmBeforeSubmitType } from './confirm-before-submit.types';

export const confirmBeforeSubmitMap: Record<ConfirmBeforeSubmitType, ConfirmBeforeSubmitData> = {
  send: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.SendTitle:Confirmer l'envoi des données ?`,
  },
  delete: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.DeleteTitle:Confirmer la suppression des données ?`,
  },
};
