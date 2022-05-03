import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeFeedbackComponent } from './demande-feedback.component';

describe('DemandeFeedbackComponent', () => {
  let component: DemandeFeedbackComponent;
  let fixture: ComponentFixture<DemandeFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
