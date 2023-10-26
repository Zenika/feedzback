import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AskFeedbackFormComponent} from './ask-feedback-form/ask-feedback-form.component';
import {HomeComponent} from './home/home.component';
import {SendAskFeedbackResultComponent} from './send-ask-feedback-result/send-ask-feedback-result.component';
import {SendFeedbackFormComponent} from './send-feedback-form/send-feedback-form.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignInGuard} from './sign-in/sign-in.guard';
import {MyFeedbacksPageComponent} from './my-feedbacks-page/my-feedbacks-page.component';
import {AuthGuard} from './services/auth-guard/auth.guard';
import {FeedbackComponent} from './feedback/feedback.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ask',
    component: AskFeedbackFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'send',
    component: SendFeedbackFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'feedbacks',
    component: MyFeedbacksPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'feedbacks/:type',
    component: MyFeedbacksPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'feedback/:id/:type',
    component: FeedbackComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'result',
    component: SendAskFeedbackResultComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SignInGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
