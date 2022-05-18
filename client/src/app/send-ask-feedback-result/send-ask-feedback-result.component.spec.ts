import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SendAskFeedbackResultComponent } from './send-ask-feedback-result.component';

describe('SendFeedbackResultComponent', () => {
  let component: SendAskFeedbackResultComponent;
  let fixture: ComponentFixture<SendAskFeedbackResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendAskFeedbackResultComponent ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'Felicitations',
              }
            }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAskFeedbackResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
