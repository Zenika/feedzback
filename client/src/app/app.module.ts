import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { SendFeedbackFormComponent } from './send-feedback-form/send-feedback-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AskFeedbackFormComponent } from './ask-feedback-form/ask-feedback-form.component';
import { SendAskFeedbackResultComponent } from './send-ask-feedback-result/send-ask-feedback-result.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MyFeedbacksPageComponent } from './my-feedbacks-page/my-feedbacks-page.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SendAskFeedbackResultComponent,
    SendFeedbackFormComponent,
    AskFeedbackFormComponent,
    MyFeedbacksPageComponent,
    FeedbackListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ApolloModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.serverApi
          })
        }
      },
      deps: [HttpLink],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
