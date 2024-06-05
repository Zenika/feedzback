import { animate, style, transition, trigger } from '@angular/animations';

export const headerAnimations = [
  trigger('smoothWidth', [
    transition('void => true', [
      style({ width: '0px', paddingLeft: '0px', paddingRight: '0px', opacity: '0' }),
      animate('500ms 500ms cubic-bezier(0.77, 0.2, 0.05, 1)'),
    ]),
  ]),
  trigger('fadeInOut', [
    transition('void => *', [style({ opacity: 0 }), animate('500ms cubic-bezier(0.77, 0.2, 0.05, 1)')]),
    transition('* => void', [animate('500ms cubic-bezier(0.77, 0.2, 0.05, 1)'), style({ opacity: 0 })]),
  ]),
];
