import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskFeedbackFormComponent } from './ask-feedback-form/ask-feedback-form.component';
import { HomeComponent } from './home/home.component';
import { SendAskFeedbackResultComponent } from './send-ask-feedback-result/send-ask-feedback-result.component';
import { SendFeedbackFormComponent } from './send-feedback-form/send-feedback-form.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToSignInPage = () => redirectUnauthorizedTo(['sign-in']);
import { MyFeedbacksPageComponent } from './my-feedbacks-page/my-feedbacks-page.component';
import { MasterAuthGuard } from './services/auth-guard/master-auth.guard';
const routes: Routes = [  
  {path:'home', component:HomeComponent, canActivate: [MasterAuthGuard], data: { authGuardPipe: redirectUnauthorizedToSignInPage }},
  {path:'ask', component:AskFeedbackFormComponent, canActivate: [MasterAuthGuard], data: { authGuardPipe: redirectUnauthorizedToSignInPage }},
  {path:'send', component:SendFeedbackFormComponent, canActivate: [MasterAuthGuard], data: { authGuardPipe: redirectUnauthorizedToSignInPage }},
  {path:'feedbacks', component:MyFeedbacksPageComponent, canActivate: [MasterAuthGuard], data: { authGuardPipe: redirectUnauthorizedToSignInPage }},
  {path:'feedback', component:FeedbackComponent, canActivate: [MasterAuthGuard], data: { authGuardPipe: redirectUnauthorizedToSignInPage }},
  {path:'sign-in', component:SignInComponent},
  {path:'**',redirectTo:'sign-in'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
