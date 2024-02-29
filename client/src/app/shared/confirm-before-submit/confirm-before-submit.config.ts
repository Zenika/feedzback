import { ConfirmBeforeSubmitData, ConfirmBeforeSubmitType } from './confirm-before-submit.types';

export const confirmBeforeSubmitMap: Record<ConfirmBeforeSubmitType, ConfirmBeforeSubmitData> = {
  sendFeedbackRequest: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.ConfirmSending:Confirmer l'envoi ?`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackRequestContent:Cliquer sur "Confirmer" pour finaliser l'envoi de votre demande de feedZback.`,
  },
  cancelFeedbackRequest: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.ConfirmAction:Confirmer l'action ?`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.CancelFeedbackRequestContent:Cliquer sur "Confirmer" pour archiver votre demande de feedZback.`,
  },
  sendRequestedFeedback: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.ConfirmSending:Confirmer l'envoi ?`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendRequestedFeedbackContent:Cliquer sur "Confirmer" pour finaliser l'envoi de votre réponse.`,
  },
  sendSpontaneousFeedback: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.ConfirmSending:Confirmer l'envoi ?`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendSpontaneousFeedbackContent:Cliquer sur "Confirmer" pour finaliser l'envoi de votre feedZback spontané.`,
  },
};
