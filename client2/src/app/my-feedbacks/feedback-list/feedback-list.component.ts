import { DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, HostBinding, Input, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BreakpointService } from '../../shared/breakpoint';
import { DivisionComponent } from '../../shared/division/division.component';
import { FeedbackType } from '../../shared/feedback/feedback.types';
import { NormalizedFeedback } from '../my-feedbacks.types';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    DivisionComponent,
  ],
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackListComponent implements AfterViewInit {
  @HostBinding('class.app-feedback-list') hasCss = true;

  @Input({ required: true }) set feedbacks(value: NormalizedFeedback[]) {
    this.dataSource = new MatTableDataSource(value);
    this.linkDataSource();
  }

  dataSource!: MatTableDataSource<NormalizedFeedback>;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected isMobile = false;

  protected columns: (keyof NormalizedFeedback | 'actions' | 'mixed')[] = ['email', 'createdAt', 'actions'];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  @ViewChild(MatSort) sort?: MatSort;

  protected readonly pageSizeOptions = [5, 10, 25, 100];

  protected get hasPaginator() {
    return this.dataSource.data.length > this.pageSizeOptions[0];
  }

  constructor() {
    inject(BreakpointService)
      .device$.pipe(takeUntilDestroyed())
      .subscribe((device) => {
        this.isMobile = device === 'mobile';
        this.columns = this.isMobile ? ['mixed', 'actions'] : ['email', 'createdAt', 'actions'];
      });
  }

  ngAfterViewInit() {
    this.linkDataSource();
  }

  protected applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  // "nf" means "normalized feedback"
  protected nf(value: unknown) {
    return value as NormalizedFeedback;
  }

  private linkDataSource() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
