import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Apollo } from 'apollo-angular';
import { Feedback } from '../model/feedback';
import { FeedbackComponent } from './feedback.component';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  const feedback = new Feedback(
    '1',
    '11',
    'Pierre',
    'pierre@exemple.com',
    'marie@example.com',
    'Marie',
    '...',
    '...',
    '...',
    '121212'
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FeedbackComponent],
      providers: [Apollo],
    }).compileComponents();
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
  it('should show sender email when the feedback type is receved', () => {
    component.type = 'Received';
    fixture.detectChanges();
    const senderEmail = fixture.debugElement.query(By.css('h4')).nativeElement
      .textContent;
    expect(senderEmail).toContain('pierre@exemple.com');
  });
  it('should show recever email when the feedback type is sent', () => {
    component.type = 'Sent';
    fixture.detectChanges();
    const receverEmail = fixture.debugElement.query(By.css('h4')).nativeElement
      .textContent;
    expect(receverEmail).toContain('marie@example.com');
  });
});
