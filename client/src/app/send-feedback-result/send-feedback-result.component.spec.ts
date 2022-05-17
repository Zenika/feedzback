import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFeedbackResultComponent } from './send-feedback-result.component';

describe('SendFeedbackResultComponent', () => {
  let component: SendFeedbackResultComponent;
  let fixture: ComponentFixture<SendFeedbackResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendFeedbackResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFeedbackResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
