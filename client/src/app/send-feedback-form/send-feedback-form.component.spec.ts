import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFeedbackFormComponent } from './send-feedback-form.component';

describe('SendFeedbackFormComponent', () => {
  let component: SendFeedbackFormComponent;
  let fixture: ComponentFixture<SendFeedbackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendFeedbackFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
