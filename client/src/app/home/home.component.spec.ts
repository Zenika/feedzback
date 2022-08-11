import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AskFeedbackFormComponent } from '../ask-feedback-form/ask-feedback-form.component';
import { SendFeedbackFormComponent } from '../send-feedback-form/send-feedback-form.component';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;
  let router: Router;
  const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'send', component: SendFeedbackFormComponent },
    { path: 'ask', component: AskFeedbackFormComponent },
    { path: '**', redirectTo: 'home' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('Home page will be created', () => {
    expect(component).toBeTruthy();
  });

  it("Send feedback button will open feedback form when it's clicked", async () => {
    fixture.debugElement
      .query(By.css('.btn-send-margin'))
      .nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toEqual('/send');
  });

  it("Ask feedback button will open ask feedback form when it's clicked", async () => {
    fixture.debugElement.query(By.css('.btn-ask-margin')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toEqual('/ask');
  });
});
