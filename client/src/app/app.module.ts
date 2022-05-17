import { NgModule } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule,APOLLO_OPTIONS } from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { DemandeFeedbackComponent } from './demande-feedback/demande-feedback.component';
import { FeedbackEnvoyeComponent } from './feedback-envoye/feedback-envoye.component';
import { DemandeEnvoyeComponent } from './demande-envoye/demande-envoye.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    FormulaireComponent,
    HomeComponent,
    DemandeFeedbackComponent,
    FeedbackEnvoyeComponent,
    DemandeEnvoyeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ApolloModule,
    HttpClientModule,
    FlexLayoutModule
 
  ],
  providers: [
    {

  
      provide:APOLLO_OPTIONS,
      useFactory:(httpLink:HttpLink)=>{
        return {
          cache:new InMemoryCache(),
          link:httpLink.create({
            uri: environment.serverApi
          })
        }
      },
      deps:[HttpLink],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
