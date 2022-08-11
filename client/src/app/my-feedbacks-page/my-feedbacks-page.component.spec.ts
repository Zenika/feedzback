import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Apollo } from 'apollo-angular'
import { ApolloTestingModule } from 'apollo-angular/testing'
import { FeedbackListComponent } from '../feedback-list/feedback-list.component'
import { AuthService } from '../services/auth.service'
import { authStub } from '../services/authStub'
import { TabLinkComponent } from '../tab-link/tab-link.component'
import { TabsComponent } from '../tabs/tabs.component'
import { MyFeedbacksPageComponent } from './my-feedbacks-page.component'

describe('MyFeedbacksPageComponent', () => {
  let component: MyFeedbacksPageComponent
  let fixture: ComponentFixture<MyFeedbacksPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        ApolloTestingModule],
      providers: [Apollo,
        { provide: AuthService, useValue: authStub }],
      declarations: [
        MyFeedbacksPageComponent,
        TabsComponent,
        TabLinkComponent,
        FeedbackListComponent
      ]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFeedbacksPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
