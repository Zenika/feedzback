import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  inject,
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
import { BreakpointService } from '../../shared/breakpoint';
import { FeedbackType } from '../../shared/feedback/feedback.types';
import { DivisionComponent } from '../../shared/ui/division/division.component';
import { NormalizedFeedback } from '../my-feedbacks.types';

@Component({
  selector: 'app-feedback-list',
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
    DivisionComponent,
  ],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackListComponent implements OnChanges, AfterViewInit {
  @HostBinding('class.app-feedback-list') hasCss = true;

  @Input({ required: true }) type!: FeedbackType;

  @Input({ transform: (value?: string) => value?.trim().toLowerCase() }) filter?: string;

  @Input({ required: true }) set feedbacks(value: NormalizedFeedback[]) {
    this.dataSource = new MatTableDataSource(value);
    this.linkDataSource();
    this.applyFilter();
  }

  dataSource!: MatTableDataSource<NormalizedFeedback>;

  protected isMobile = false;

  protected columns: (keyof NormalizedFeedback | 'actions' | 'mixed')[] = ['email', 'date', 'actions'];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  @ViewChild(MatSort) sort?: MatSort;

  protected readonly pageSizeOptions = [10, 25, 100];

  protected get hasPaginator() {
    return this.dataSource.data.length > this.pageSizeOptions[0];
  }

  constructor() {
    inject(BreakpointService)
      .device$.pipe(takeUntilDestroyed())
      .subscribe((device) => {
        this.isMobile = device === 'mobile';
        this.columns = this.isMobile ? ['mixed', 'actions'] : ['email', 'date', 'actions'];
      });
  }

  ngOnChanges({ filter }: SimpleChanges): void {
    if (filter) {
      this.applyFilter();
    }
  }

  ngAfterViewInit() {
    this.linkDataSource();
    this.applyFilter();
  }

  // "nf" means "normalized feedback"
  protected nf(value: unknown) {
    return value as NormalizedFeedback;
  }

  private linkDataSource() {
    if (!this.paginator || !this.sort) {
      return;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private applyFilter() {
    if (!this.dataSource.paginator) {
      return;
    }
    this.dataSource.filterPredicate = (data, filter) => data.email.toLowerCase().includes(filter);
    this.dataSource.filter = this.filter ?? '';
    this.dataSource.paginator.firstPage();
  }
}
