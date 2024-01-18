import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedbackType } from '../shared/feedback/feedback.types';
import FeedbackDetailsComponent from './feedback-details.component';

describe('FeedbackDetailsComponent', () => {
  let component: FeedbackDetailsComponent;
  let fixture: ComponentFixture<FeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackDetailsComponent, RouterTestingModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackDetailsComponent);
    component = fixture.componentInstance;

    component.feedbackDetails = {
      feedback: {
        id: 'id',
        giverEmail: 'giverEmail',
        receiverEmail: 'receiverEmail',
        positive: 'positive',
        negative: 'negative',
        comment: 'comment',
        message: 'message',
        shared: false,
        status: 'done',
        createdAt: 0,
        updatedAt: 0,
      },
      type: FeedbackType.given,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app-done-feedback when feedback.status == done', () => {
    const appDoneFeedback = (fixture.nativeElement as HTMLElement).querySelector('app-done-feedback');
    const appPendingFeedback = (fixture.nativeElement as HTMLElement).querySelector('app-pending-feedback');
    expect(appDoneFeedback).toBeTruthy();
    expect(appPendingFeedback).toBeFalsy();
  });

  it('should display app-pending-feedback when feedback.status == pending', () => {
    component.feedbackDetails.feedback.status = 'pending';
    fixture.detectChanges();

    const appDoneFeedback = (fixture.nativeElement as HTMLElement).querySelector('app-done-feedback');
    const appPendingFeedback = (fixture.nativeElement as HTMLElement).querySelector('app-pending-feedback');

    expect(appDoneFeedback).toBeFalsy();
    expect(appPendingFeedback).toBeTruthy();
  });
});
