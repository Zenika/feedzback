import { Component, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { GiveRequestedFeedbackListService } from '../../give-feedback/give-requested-feedback-list/give-requested-feedback-list.service';
import { BreakpointService } from '../../shared/breakpoint';
import { EmployeeService } from '../../shared/employee';
import { FocusContentOnRoutingDirective } from '../../shared/focus-content';
import { navAnimation } from './nav.animation';

@Component({
  selector: 'app-nav',
  host: { class: 'app-nav' },
  imports: [RouterLinkActive, RouterLinkWithHref, MatBadgeModule, FocusContentOnRoutingDirective],
  animations: [navAnimation],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
  protected receivedRequestLength = inject(GiveRequestedFeedbackListService).listLength;

  protected isManager = inject(EmployeeService).isManager;

  protected device = toSignal(inject(BreakpointService).device$);
}
