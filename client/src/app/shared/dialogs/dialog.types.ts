export interface DialogData {
  title: string;
  content?: string;
  cancel?: DialogAction;
  confirm?: DialogAction;
}

export interface DialogAction {
  label: string;
  icon?: string;
}
