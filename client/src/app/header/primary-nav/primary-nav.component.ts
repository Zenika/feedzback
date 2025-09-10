import { Component, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { GiveRequestedFeedbackListService } from '../../give-feedback/give-requested-feedback-list/give-requested-feedback-list.service';
import { BreakpointService } from '../../shared/breakpoint';
import { EmployeeService } from '../../shared/employee';
import { primaryNavAnimation } from './primary-nav.animation';

@Component({
  selector: 'app-primary-nav',
  host: { class: 'app-primary-nav' },
  imports: [RouterLinkActive, RouterLinkWithHref, MatBadgeModule],
  animations: [primaryNavAnimation],
  templateUrl: './primary-nav.component.html',
  styleUrl: './primary-nav.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PrimaryNavComponent {
  protected receivedRequestLength = inject(GiveRequestedFeedbackListService).listLength;

  protected isManager = inject(EmployeeService).isManager;

  protected device = toSignal(inject(BreakpointService).device$);
}
