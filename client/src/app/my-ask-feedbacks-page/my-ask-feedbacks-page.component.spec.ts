import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Apollo} from 'apollo-angular';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AskFeedbackListComponent} from '../ask-feedback-list/ask-feedback-list.component';
import {AuthService} from '../services/auth.service';
import {authStub} from '../services/authStub';
import {TabLinkComponent} from '../tab-link/tab-link.component';
import {TabsComponent} from '../tabs/tabs.component';

import {MyAskFeedbacksPageComponent} from './my-ask-feedbacks-page.component';

describe('MyAskFeedbacksPageComponent', () => {
  let component: MyAskFeedbacksPageComponent;
  let fixture: ComponentFixture<MyAskFeedbacksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAskFeedbacksPageComponent],
    })
        .compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ApolloTestingModule],
      providers: [Apollo, {provide: AuthService, useValue: authStub}],
      declarations: [
        MyAskFeedbacksPageComponent,
        TabsComponent,
        TabLinkComponent,
        AskFeedbackListComponent,
      ],
    }).compileComponents();
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
