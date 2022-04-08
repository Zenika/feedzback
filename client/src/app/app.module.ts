import { isDevMode, NgModule } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule,APOLLO_OPTIONS } from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { LineBreakPipePipe } from './line-break-pipe.pipe';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    FormulaireComponent,
    LineBreakPipePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ApolloModule,
    HttpClientModule,
    
 
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
