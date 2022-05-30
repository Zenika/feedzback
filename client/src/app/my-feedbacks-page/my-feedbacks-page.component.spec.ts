import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { FeedbackListComponent } from '../feedback-list/feedback-list.component';
import { TabLinkComponent } from '../tab-link/tab-link.component';
import { TabsComponent } from '../tabs/tabs.component';
import { MyFeedbacksPageComponent } from './my-feedbacks-page.component';

describe('MyFeedbacksPageComponent', () => {
  let component: MyFeedbacksPageComponent;
  let fixture: ComponentFixture<MyFeedbacksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Apollo],
      declarations: [
        MyFeedbacksPageComponent,
        TabsComponent,
        TabLinkComponent,
        FeedbackListComponent
      ]
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
