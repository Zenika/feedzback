import { animate, style, transition, trigger } from '@angular/animations';

export const loadingAnimations = [
  trigger('fadeInOut', [
    transition('void => *', [style({ opacity: 0 }), animate('250ms ease')]),
    transition('* => void', [animate('250ms ease'), style({ opacity: 0 })]),
  ]),
];
