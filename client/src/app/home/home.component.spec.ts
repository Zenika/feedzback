import { Location } from '@angular/common';
import { ComponentFixture, TestBed,inject, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SendFeedbackFormComponent } from '../send-feedback-form/send-feedback-form.component';



import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;
  let router: Router;
  const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'send-feedback', component:SendFeedbackFormComponent},
    {path:'**',redirectTo:'home'}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [RouterTestingModule.withRoutes(routes)]
    })
    .compileComponents();
  

  });

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();

  });

  it('Home page will be created', ()=>{
    expect(component).toBeTruthy();
  })

  it("Send feedback button will open feedback form when it's clicked", ()=>{
  fixture.debugElement.query(By.css('.home-send-feedback-btn')).nativeElement.click();
  fixture.detectChanges();
  fixture.whenStable().then(() => {
 
    expect(location.path()).toEqual('/send-feedback');
  
    });
    
  })
});
