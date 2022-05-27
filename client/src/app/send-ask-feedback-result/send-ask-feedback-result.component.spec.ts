import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { SendAskFeedbackResultComponent } from './send-ask-feedback-result.component';
import { HomeComponent } from '../home/home.component';
import { SendFeedbackFormComponent } from '../send-feedback-form/send-feedback-form.component';
import { result } from 'cypress/types/lodash';

describe('SendFeedbackResultComponent', () => {
  let component: SendAskFeedbackResultComponent;
  let fixture: ComponentFixture<SendAskFeedbackResultComponent>;
  let location: Location;
  let router: Router;
  const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'send',component:SendFeedbackFormComponent},
    {path:'**',redirectTo:'home'}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendAskFeedbackResultComponent ],
      imports: [RouterTestingModule.withRoutes(routes)],
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
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(SendAskFeedbackResultComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  });

  it("Return button will navigate to home page when it's clicked", ()=>{

    fixture.debugElement.query(By.css('.btn-return')).nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/home');
      });  
    })

  it("Retry button will navigate to send feedback page when it's clicked", ()=>{
       if(component.result.includes('false')){
      fixture.debugElement.query(By.css('.btn-retry')).nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        if(component.result ==='falseSend')
        expect(location.path()).toEqual('/send');
        else
        expect(location.path()).toEqual('/ask');
        });  
      } else 
         expect(fixture.debugElement.query(By.css('.btn-retry'))).toBeNull();
    })
});
