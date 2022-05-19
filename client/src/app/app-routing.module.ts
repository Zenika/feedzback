import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandeEnvoyeComponent } from './demande-envoye/demande-envoye.component';
import { DemandeFeedbackComponent } from './demande-feedback/demande-feedback.component';
import { FeedbackEnvoyeComponent } from './feedback-envoye/feedback-envoye.component';
import { HomeComponent } from './home/home.component';
import { SendAskFeedbackResultComponent } from './send-ask-feedback-result/send-ask-feedback-result.component';
import { SendFeedbackFormComponent } from './send-feedback-form/send-feedback-form.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'demandeFeedback',component:DemandeFeedbackComponent},
  {path:'feedbackEnvoye',component:FeedbackEnvoyeComponent},
  {path:'demandeEnvoye',component:DemandeEnvoyeComponent},
  {path:'result',component:SendAskFeedbackResultComponent},
  {path:'send-feedback', component:SendFeedbackFormComponent},
  {path:'**',redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
