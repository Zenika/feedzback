import { animate, state, style, transition, trigger } from '@angular/animations';

export const managerFeedbackListAnimations = [
  trigger('detailExpand', [
    state('collapsed,void', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('225ms ease')),
  ]),
];
