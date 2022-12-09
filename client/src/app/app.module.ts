import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {InMemoryCache} from '@apollo/client/core';
import {HttpClientModule} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {HomeComponent} from './home/home.component';
import {SendFeedbackFormComponent} from './send-feedback-form/send-feedback-form.component';
import {AskFeedbackFormComponent} from './ask-feedback-form/ask-feedback-form.component';
import {SendAskFeedbackResultComponent} from './send-ask-feedback-result/send-ask-feedback-result.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {SignInComponent} from './sign-in/sign-in.component';
import {RouterModule} from '@angular/router';
import {MyFeedbacksPageComponent} from './my-feedbacks-page/my-feedbacks-page.component';
import {FeedbackListComponent} from './feedback-list/feedback-list.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabLinkComponent} from './tab-link/tab-link.component';
import {Nl2brPipe} from './pipe/nl2br/nl2br.pipe';
import {FeedbackComponent} from './feedback/feedback.component';
import { MyAskFeedbacksPageComponent } from './my-ask-feedbacks-page/my-ask-feedbacks-page.component';
import { AskFeedbackListComponent } from './ask-feedback-list/ask-feedback-list.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SendAskFeedbackResultComponent,
    SendFeedbackFormComponent,
    AskFeedbackFormComponent,
    SignInComponent,
    MyFeedbacksPageComponent,
    FeedbackListComponent,
    TabsComponent,
    TabLinkComponent,
    Nl2brPipe,
    FeedbackComponent,
    MyAskFeedbacksPageComponent,
    AskFeedbackListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ApolloModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    RouterModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.serverApi,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
