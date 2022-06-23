import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Apollo } from 'apollo-angular';
import { Feedback } from '../model/feedback';

import { FeedbackComponent } from './feedback.component';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  const feedback = new Feedback('1','11','Pierre','Pierre@exemple.com', 
  'marie@example.com', 'marie', '...', '...', '...', '121212');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ FeedbackComponent ],
      providers: [Apollo]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    component.feedback = feedback;
    fixture.detectChanges();
  });

  it('should create', () => {
 
    expect(component).toBeTruthy();
  });
});
