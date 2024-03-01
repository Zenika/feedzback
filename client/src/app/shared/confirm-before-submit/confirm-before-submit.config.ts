import { ConfirmBeforeSubmitData, ConfirmBeforeSubmitType } from './confirm-before-submit.types';

export const confirmBeforeSubmitMap: Record<ConfirmBeforeSubmitType, ConfirmBeforeSubmitData> = {
  sendFeedbackRequest: {
    title: $localize`:@@Action.Send:Envoyer`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendFeedbackRequestContent:Voulez-vous envoyer votre demande de feedZback ?`,
    action: { label: $localize`:@@Action.Send:Envoyer`, icon: 'send' },
  },
  cancelFeedbackRequest: {
    title: $localize`:@@Action.Archive:Archiver`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.CancelFeedbackRequestContent:Voulez-vous archiver votre demande de feedZback ?`,
    action: { label: $localize`:@@Action.Archive:Archiver`, icon: 'archive' },
  },
  sendRequestedFeedback: {
    title: $localize`:@@Action.Send:Envoyer`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendRequestedFeedbackContent:Voulez-vous envoyer votre feedZback ? Notez qu'un feedZback envoyé n'est plus modifiable.`,
    action: { label: $localize`:@@Action.Send:Envoyer`, icon: 'send' },
  },
  sendSpontaneousFeedback: {
    title: $localize`:@@Action.Send:Envoyer`,
    content: $localize`:@@Component.ConfirmBeforeSubmit.SendSpontaneousFeedbackContent:Voulez-vous envoyer votre feedZback spontané ? Notez qu'un feedZback envoyé n'est plus modifiable.`,
    action: { label: $localize`:@@Action.Send:Envoyer`, icon: 'send' },
  },
};
