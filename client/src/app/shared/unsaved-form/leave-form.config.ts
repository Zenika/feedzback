import { DialogData } from '../dialog';
import { LeaveFormType } from './leave-form.types';

export const leaveFormMap: Record<LeaveFormType, DialogData> = {
  quitFeedback: {
    title: $localize`:@@Component.LeaveForm.QuitFeedbackTitle:Quitter la page ?`,
    content: $localize`:@@Component.LeaveForm.QuitFeedbackContent:Si vous quittez la page, le feedZback que vous avez commencé à rédiger sera perdu.`,
    confirm: { label: $localize`:@@Action.Quit:Quitter`, icon: 'alt_route' },
  },

  applyFeedbackDraft: {
    title: $localize`:@@Component.LeaveForm.ApplyFeedbackDraftTitle:Appliquer le brouillon ?`,
    content: $localize`:@@Component.LeaveForm.ApplyFeedbackDraftContent:Si vous appliquez le brouillon, le feedZback que vous avez commencé à rédiger sera perdu.`,
    confirm: { label: $localize`:@@Action.Apply:Appliquer`, icon: 'edit_note' },
  },
};
