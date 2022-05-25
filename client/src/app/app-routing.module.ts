import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskFeedbackFormComponent } from './ask-feedback-form/ask-feedback-form.component';
import { HomeComponent } from './home/home.component';
import { SendAskFeedbackResultComponent } from './send-ask-feedback-result/send-ask-feedback-result.component';
import { SendFeedbackFormComponent } from './send-feedback-form/send-feedback-form.component';
import { MyFeedbacksPageComponent } from './my-feedbacks-page/my-feedbacks-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'ask', component: AskFeedbackFormComponent },
  { path: 'send', component: SendFeedbackFormComponent },
  { path: 'result', component: SendAskFeedbackResultComponent },
  { path: 'feedbacks', component: MyFeedbacksPageComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
