import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAskFeedbacksPageComponent } from './my-ask-feedbacks-page.component';

describe('MyAskFeedbacksPageComponent', () => {
  let component: MyAskFeedbacksPageComponent;
  let fixture: ComponentFixture<MyAskFeedbacksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAskFeedbacksPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAskFeedbacksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
