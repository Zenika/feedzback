import { DialogData } from '../dialog';
import { UnsavedFormDialogType } from './unsaved-form.types';

export const unsavedFormDialogMap: Record<UnsavedFormDialogType, DialogData> = {
  /** @deprecated */
  quitFeedback: {
    title: $localize`:@@Component.UnsavedForm.QuitFeedbackTitle:Quitter la page ?`,
    content: $localize`:@@Component.UnsavedForm.QuitFeedbackContent:Si vous quittez la page, le feedZback que vous avez commencé à rédiger sera perdu.`,
    confirm: { label: $localize`:@@Action.Quit:Quitter`, icon: 'alt_route' },
  },

  applyFeedbackDraft: {
    title: $localize`:@@Component.UnsavedForm.ApplyFeedbackDraftTitle:Appliquer le brouillon ?`,
    content: $localize`:@@Component.UnsavedForm.ApplyFeedbackDraftContent:Si vous appliquez le brouillon, le feedZback que vous avez commencé à rédiger sera perdu.`,
    confirm: { label: $localize`:@@Action.Apply:Appliquer`, icon: 'edit_note' },
  },
};
