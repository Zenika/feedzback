import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../breakpoint';
import { SlashModule } from '../../slash';
import { FeedbackType, NormalizedFeedback } from '../feedback.types';
import { GiveRequestedFeedbackDirective } from '../give-requested-feedback.directive';

@Component({
  selector: 'app-feedback-list',
  host: { class: 'app-feedback-list' },
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    SlashModule,
    GiveRequestedFeedbackDirective,
  ],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackListComponent implements AfterViewInit {
  feedbacks = input.required<NormalizedFeedback[]>();

  filter = input(undefined, { transform: (value?: string) => value?.trim().toLowerCase() });

  asManager = input(false, { transform: booleanAttribute });

  protected dataSource = new MatTableDataSource<NormalizedFeedback>([]);

  protected columns: (keyof NormalizedFeedback | 'actions' | 'mixed')[] = ['email', 'date', 'actions'];

  protected readonly pageSizeOptions = [10, 25, 100];

  sort = viewChild(MatSort);

  paginator = viewChild(MatPaginator);

  protected get hasPaginator() {
    return this.dataSource.data.length > this.pageSizeOptions[0];
  }

  private isMobile = false;

  constructor() {
    effect(() => {
      this.dataSource = new MatTableDataSource(this.feedbacks());
      this.init();
    });

    effect(() => this.applyFilter(this.filter()), { allowSignalWrites: true });

    inject(BreakpointService)
      .device$.pipe(takeUntilDestroyed())
      .subscribe((device) => {
        this.isMobile = device === 'mobile';
        this.columns = this.isMobile ? ['mixed', 'actions'] : ['email', 'date', 'actions'];
      });
  }

  ngAfterViewInit() {
    this.init();
  }

  // "nf" means "normalized feedback"
  protected nf(value: unknown) {
    return value as NormalizedFeedback;
  }

  protected getActionLabel(type: FeedbackType) {
    return type === 'received' || type === 'given'
      ? $localize`:@@Action.ViewFeedback:Consulter le feedZback`
      : $localize`:@@Action.ViewFeedbackRequest:Consulter la demande`;
  }

  private init() {
    this.linkDataSource();
    this.applyFilter(this.filter());
  }

  private linkDataSource() {
    const paginator = this.paginator();
    const sort = this.sort();

    if (!paginator || !sort) {
      return;
    }

    this.dataSource.paginator = paginator;
    this.dataSource.sort = sort;
  }

  private applyFilter(filter?: string) {
    if (!this.dataSource.paginator) {
      return;
    }
    this.dataSource.filterPredicate = (data, filter) => data.email.toLowerCase().includes(filter);
    this.dataSource.filter = filter ?? '';
    this.dataSource.paginator.firstPage();
  }
}
