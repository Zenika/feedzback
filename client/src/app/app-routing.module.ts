import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskFeedbackFormComponent } from './ask-feedback-form/ask-feedback-form.component';
import { DemandeEnvoyeComponent } from './demande-envoye/demande-envoye.component';
import { DemandeFeedbackComponent } from './demande-feedback/demande-feedback.component';
import { FeedbackEnvoyeComponent } from './feedback-envoye/feedback-envoye.component';
import { HomeComponent } from './home/home.component';
import { SendFeedbackFormComponent } from './send-feedback-form/send-feedback-form.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'demandeFeedback',component:DemandeFeedbackComponent},
  {path:'ask',component:AskFeedbackFormComponent},
  {path:'feedbackEnvoye',component:FeedbackEnvoyeComponent},
  {path:'demandeEnvoye',component:DemandeEnvoyeComponent},
  {path:'send', component:SendFeedbackFormComponent},
  {path:'**',redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
