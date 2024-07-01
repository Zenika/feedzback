export type DialogData = {
  title: string;
  content?: string;
  cancel?: DialogAction;
  confirm?: DialogAction;
};

export type DialogAction = {
  label: string;
  icon?: string;
};
