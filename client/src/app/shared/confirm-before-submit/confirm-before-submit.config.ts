import { ConfirmBeforeSubmitData, ConfirmBeforeSubmitType } from './confirm-before-submit.types';

export const confirmBeforeSubmitMap: Record<ConfirmBeforeSubmitType, ConfirmBeforeSubmitData> = {
  sendFeedbackRequest: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackRequestTitle:Confirmer l'envoi`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackRequestContent:Notez qu'une fois envoyée, votre demande de feedZback ne sera plus modifiable.`,
    action: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },

  cancelFeedbackRequest: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.CancelFeedbackRequestTitle:Confirmer l'archivage`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.CancelFeedbackRequestContent:Notez qu'une fois archivée, votre demande de feedZback sera retirée de votre historique.`,
    action: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },

  sendFeedback: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackTitle:Confirmer l'envoi`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackContent:Notez qu'une fois envoyé, votre feedZback ne sera plus modifiable.`,
    action: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },
};
