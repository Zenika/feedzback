import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, HostBinding, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { FeedbackBodyComponent } from '../../shared/feedback/feedback-body/feedback-body.component';
import { Feedback, FeedbackType } from '../../shared/feedback/feedback.types';
import { managerFeedbackListAnimations } from './manager-feedback-list.animations';

// Note: the manager view is not optimzed for mobile device and should be used on desktop :)

@Component({
  selector: 'app-manager-feedback-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    FeedbackBodyComponent,
  ],
  templateUrl: './manager-feedback-list.component.html',
  styleUrl: './manager-feedback-list.component.scss',
  animations: managerFeedbackListAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ManagerFeedbackListComponent implements AfterViewInit {
  @HostBinding('class.app-manager-feedback-list') hasCss = true;

  @Input({ required: true }) set feedbacks(value: Feedback[]) {
    this.dataSource = new MatTableDataSource(value);
    this.linkDataSource();
    this.applyFilter();
  }

  protected filter = '';

  protected dataSource!: MatTableDataSource<Feedback>;

  protected columns = ['email', 'date', 'expand'];

  protected expandedFeedback: Feedback | null = null;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  @ViewChild(MatSort) sort?: MatSort;

  protected readonly pageSizeOptions = [10, 25, 100];

  protected get hasPaginator() {
    return this.dataSource.data.length > this.pageSizeOptions[0];
  }

  protected feedbackType = FeedbackType;

  ngAfterViewInit() {
    this.linkDataSource();
    this.applyFilter();
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
    this.dataSource.filterPredicate = (data, filter) => data.giverEmail.toLowerCase().includes(filter);
    this.dataSource.filter = this.filter ?? '';
    this.dataSource.paginator.firstPage();
  }

  protected onFilter(value: string) {
    this.filter = value;
    this.applyFilter();
  }

  // "f" means "feedback"
  protected f(value: unknown) {
    return value as Feedback;
  }
}
