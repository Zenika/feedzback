import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedbackType } from '../enum/feedback-type';
import { Feedback } from '../model/feedback';
import { Nl2brPipe } from '../pipe/nl2br/nl2br.pipe';
import { FeedbackComponent } from '../feedback/feedback.component';
import { FeedbackListComponent } from './feedback-list.component';
import { Location } from '@angular/common';

describe('FeedbackListComponent', () => {
  let component: FeedbackListComponent;
  let fixture: ComponentFixture<FeedbackListComponent>;
  let location: Location;
  let router: Router;
  const routes: Routes = [
    {path:'feedback/:id/:type',component:FeedbackComponent},
  ];
  const feedbacks: Feedback[] = [ new Feedback('123', 'token', 'Pierre',
      'pierre@example.com', 'marie@example.com', 'marie')]
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        RouterTestingModule.withRoutes(routes)],
      declarations: [
        FeedbackListComponent,
        Nl2brPipe
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(FeedbackListComponent);
    component = fixture.componentInstance;
    component.feedbacks = feedbacks
    component.type = FeedbackType.Sent
    router.initialNavigation();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the empty template when feedbacks list is null' ,() => {
    component.feedbacks = []
    fixture.detectChanges()
    const emptyTemplate = fixture.debugElement.query(By.css('.empty'))
    expect(emptyTemplate).toBeTruthy()
  });
  it('empty template should be disapeared when the feedback list is not null', ()=> {
      const emptyTemplate = fixture.debugElement.query(By.css('.empty'))
      expect(emptyTemplate).toBeFalsy()
  });
  it('the feedback list will be appeared when the list contains feedbacks', ()=> {
    const feedbackList = fixture.debugElement.query(By.css('.list'))
    expect(feedbackList).toBeTruthy()
  });
  it('should show the sent feedbacks when the feedzbacks envoyés tab is clicked', ()=> {
    const senderName = fixture.debugElement.query(By.css('a'))
    expect(senderName.nativeElement.textContent.trim()).toEqual(feedbacks[0].receverName)
  });
  it('should show the recevied feedbacks when the feedzbacks reçus tab is clicked', ()=> {
    component.type = FeedbackType.Received
    fixture.detectChanges()
    const senderName = fixture.debugElement.query(By.css('a'))
    expect(senderName.nativeElement.textContent). toContain(feedbacks[0].senderName)
  });
  it('should open the feedback detail of a sent feedback when the recevier name is clicked in the list', async ()=> {
    fixture.debugElement.query(By.css('a')).nativeElement.click(); 
    fixture.detectChanges();
    await fixture.whenStable()
    expect(location.path()).toEqual(`/feedback/${feedbacks[0].id}/Sent`)
  }) 
  it('should open the feedback detail of a recivied feedback when the sender name is clicked in the list', ()=> {
    component.type = FeedbackType.Received
    fixture.detectChanges();
    fixture.debugElement.query(By.css('a')).nativeElement.click(); 
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual(`/feedback/${feedbacks[0].id}/Received`)
      })
  })
});
