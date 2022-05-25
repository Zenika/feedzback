import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFeedbacksPageComponent } from './my-feedbacks-page.component';

describe('MyFeedbacksPageComponent', () => {
  let component: MyFeedbacksPageComponent;
  let fixture: ComponentFixture<MyFeedbacksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyFeedbacksPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFeedbacksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
