import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAskFeedbackResultComponent } from './send-ask-feedback-result.component';

describe('SendFeedbackResultComponent', () => {
  let component: SendAskFeedbackResultComponent;
  let fixture: ComponentFixture<SendAskFeedbackResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendAskFeedbackResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAskFeedbackResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
