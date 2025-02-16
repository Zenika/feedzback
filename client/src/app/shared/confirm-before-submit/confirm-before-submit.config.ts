import { DialogData } from '../dialog';
import { ConfirmBeforeSubmitType } from './confirm-before-submit.types';

export const confirmBeforeSubmitMap: Record<ConfirmBeforeSubmitType, DialogData> = {
  sendFeedbackRequest: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackRequestTitle:Confirmer l'envoi`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackRequestContent:Notez qu'une fois envoyée, votre demande de feedZback ne sera plus modifiable.`,
    confirm: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },

  archiveFeedbackRequest: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.ArchiveFeedbackRequestTitle:Confirmer l'archivage`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.ArchiveFeedbackRequestContent:Notez qu'une fois archivée, la demande de feedZback sera retirée de votre historique.`,
    confirm: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },

  sendFeedback: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackTitle:Confirmer l'envoi`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackContent:Notez qu'une fois envoyé, votre feedZback ne sera plus modifiable.`,
    confirm: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },

  archiveFeedback: {
    title: $localize`:@@Component.ConfirmBeforeSubmit.ArchiveFeedbackTitle:Confirmer l'archivage`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.ArchiveFeedbackContent:Notez qu'une fois archivé, le feedZback sera retiré de votre historique.`,
    confirm: { label: $localize`:@@Action.Confirm:Confirmer`, icon: 'check' },
  },
};
