import { DialogData } from '../../shared/dialog';

export const giveFeedbackDraftDialogData: DialogData = {
  title: $localize`:@@Component.GiveFeedback.ApplyDraftTitle:Appliquer le brouillon ?`,
  content: $localize`:@@Component.GiveFeedback.ApplyDraftContent:Si vous appliquez le brouillon, le feedZback que vous avez commencé à rédiger sera perdu.`,
  confirm: { label: $localize`:@@Action.Apply:Appliquer`, icon: 'edit_note' },
};
