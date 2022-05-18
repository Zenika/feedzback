import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskFeedbackFormComponent } from './ask-feedback-form.component';

describe('AskFeedbackFormComponent', () => {
  let component: AskFeedbackFormComponent;
  let fixture: ComponentFixture<AskFeedbackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskFeedbackFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
