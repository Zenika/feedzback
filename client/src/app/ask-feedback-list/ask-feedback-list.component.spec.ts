import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskFeedbackListComponent } from './ask-feedback-list.component';

describe('AskFeedbackListComponent', () => {
  let component: AskFeedbackListComponent;
  let fixture: ComponentFixture<AskFeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskFeedbackListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
