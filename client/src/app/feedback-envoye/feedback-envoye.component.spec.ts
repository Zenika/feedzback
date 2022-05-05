import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEnvoyeComponent } from './feedback-envoye.component';

describe('FeedbackEnvoyeComponent', () => {
  let component: FeedbackEnvoyeComponent;
  let fixture: ComponentFixture<FeedbackEnvoyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackEnvoyeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackEnvoyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
