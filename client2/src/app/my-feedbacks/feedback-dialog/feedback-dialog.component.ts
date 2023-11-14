import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { getFeedbackType } from '../../shared/feedback/feedback.helpers';
import { FeedbackType } from '../../shared/feedback/feedback.types';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [NgIf, RouterLink, MatButtonModule, MatDialogModule, MatIconModule, FeedbackComponent],
  templateUrl: './feedback-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialogTmplRef') dialogTmplRef!: TemplateRef<unknown>;

  @Input({ required: true }) id!: string;

  protected type?: FeedbackType;

  protected feedbackType = FeedbackType;

  private dialog = inject(MatDialog);

  private activatedRoute = inject(ActivatedRoute);

  private router = inject(Router);

  private subscription?: Subscription;

  private get typeFromParentRoute() {
    return getFeedbackType(this.activatedRoute.parent?.snapshot.params['type']);
  }

  ngAfterViewInit(): void {
    this.type = this.typeFromParentRoute;
    if (!this.type) {
      return;
    }
    this.subscription = this.openDialog();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // This is tricky: prevent `this.goBack()` to be executed!
    this.closeDialog();
  }

  private openDialog() {
    if (this.dialog.openDialogs.length) {
      return;
    }
    return this.dialog
      .open(this.dialogTmplRef, { width: '90vw', maxWidth: '768px' })
      .afterClosed()
      .subscribe(() => this.goBack());
  }

  private goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  private closeDialog() {
    this.dialog.closeAll();
  }
}
