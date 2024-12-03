import { animate, style, transition, trigger } from '@angular/animations';

export const headerAnimation = trigger('fadeInOut', [
  transition('void => *', [style({ opacity: 0 }), animate('500ms cubic-bezier(0.77, 0.2, 0.05, 1)')]),
  transition('* => void', [animate('500ms cubic-bezier(0.77, 0.2, 0.05, 1)'), style({ opacity: 0 })]),
]);
