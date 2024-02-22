import { Signal } from '@angular/core';

export type ManagerData = {
  employee: string | Signal<string>;
};
