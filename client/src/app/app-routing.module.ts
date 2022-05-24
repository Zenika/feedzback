import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskFeedbackFormComponent } from './ask-feedback-form/ask-feedback-form.component';
import { DemandeEnvoyeComponent } from './demande-envoye/demande-envoye.component';
import { FeedbackEnvoyeComponent } from './feedback-envoye/feedback-envoye.component';
import { HomeComponent } from './home/home.component';
import { SendAskFeedbackResultComponent } from './send-ask-feedback-result/send-ask-feedback-result.component';
import { SendFeedbackFormComponent } from './send-feedback-form/send-feedback-form.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'ask',component:AskFeedbackFormComponent},
  {path:'feedbackEnvoye',component:FeedbackEnvoyeComponent},
  {path:'demandeEnvoye',component:DemandeEnvoyeComponent},
  {path:'send', component:SendFeedbackFormComponent},
  {path:'result', component:SendAskFeedbackResultComponent},
  {path:'sign-in', component:SignInComponent}
  {path:'**',redirectTo:'sign-in'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
