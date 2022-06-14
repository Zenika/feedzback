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
const routes: Routes = [  
  // {
  //   path: "", 
  //   canActivate: [AngularFireAuthGuard],data: { authGuardPipe: redirectUnauthorizedToSignInPage },
  //   children: [
      {path:'home', component:HomeComponent},
      {path:'ask', component:AskFeedbackFormComponent},
      {path:'send', component:SendFeedbackFormComponent},
      {path:'result', component:SendAskFeedbackResultComponent},
      {path:'feedbacks', component:MyFeedbacksPageComponent}
  //   ]
  // },
  ,
  {path:'sign-in', component:SignInComponent},
  { path: 'feedbacks', component:MyFeedbacksPageComponent},
  {path:'**',redirectTo:'sign-in'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
