import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {Apollo} from 'apollo-angular';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {FeedbackType} from '../enum/feedback-type';
import {AskFeedback} from '../model/askFeedback';
import {Nl2brPipe} from '../pipe/nl2br/nl2br.pipe';
import {AuthService} from '../services/auth.service';
import {authStub} from '../services/authStub';

import {AskFeedbackListComponent} from './ask-feedback-list.component';

describe('AskFeedbackListComponent', () => {
  let component: AskFeedbackListComponent;
  let fixture: ComponentFixture<AskFeedbackListComponent>;
  const feedbacks: AskFeedback[] = [
    new AskFeedback(
        '123',
        'token',
        'Pierre',
        'pierre@example.com',
        'marie@example.com',
        'marie',
    ),
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ApolloTestingModule],
      providers: [Apollo, {provide: AuthService, useValue: authStub}],
      declarations: [AskFeedbackListComponent, Nl2brPipe],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskFeedbackListComponent);
    component = fixture.componentInstance;
    component.askFeedbacks = feedbacks;
    component.type = FeedbackType.Sent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the empty template when feedbacks list is null', () => {
    component.askFeedbacks = [];
    fixture.detectChanges();
    const emptyTemplate = fixture.debugElement.query(By.css('.empty'));
    expect(emptyTemplate).toBeTruthy();
  });
  it('empty template should be disapeared when the ask feedback list is not null', () => {
    const emptyTemplate = fixture.debugElement.query(By.css('.empty'));
    expect(emptyTemplate).toBeFalsy();
  });
  it('the ask feedback list will be appeared when the list contains ask feedbacks', () => {
    const feedbackList = fixture.debugElement.query(By.css('.list'));
    expect(feedbackList).toBeTruthy();
  });
  it('should show the sent ask feedbacks when the ask feedzbacks envoyés tab is clicked', () => {
    const senderName = fixture.debugElement.query(By.css('a'));
    expect(senderName.nativeElement.textContent).toContain(
        feedbacks[0].receverName,
    );
  });
  it('should show the recevied  ask feedbacks when the feedzbacks reçus tab is clicked', () => {
    component.type = FeedbackType.Received;
    fixture.detectChanges();
    const senderName = fixture.debugElement.query(By.css('a'));
    expect(senderName.nativeElement.textContent).toContain(
        feedbacks[0].senderName,
    );
  });
});
