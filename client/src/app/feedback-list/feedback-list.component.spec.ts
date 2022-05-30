import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackType } from '../enum/feedback-type';
import { Feedback } from '../model/feedback';

import { FeedbackListComponent } from './feedback-list.component';

describe('FeedbackListComponent', () => {
  let component: FeedbackListComponent;
  let fixture: ComponentFixture<FeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackListComponent);
    component = fixture.componentInstance;
    component.type = FeedbackType.Received
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "From:" if type is "Received"', () => {
    component.feedbacks = [new Feedback("John", "john@gmail.com", "Steve", "steve@gmail.com", "Very good", "Wack af", "Good evening")]
    component.type = FeedbackType.Received
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("span").textContent).toContain('From:');
  })

  it('should display "To:" if type is "Sent"', () => {
    component.feedbacks = [new Feedback("John", "john@gmail.com", "Steve", "steve@gmail.com", "Very good", "Wack af", "Good evening")]
    component.type = FeedbackType.Sent
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("span").textContent).toContain('To:');
  })

  it('should display a message when the list is empty', () => {
    expect(fixture.nativeElement.querySelector("span").textContent).toContain('Aucun feedback');
  })
});
