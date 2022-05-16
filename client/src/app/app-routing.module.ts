import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandeEnvoyeComponent } from './demande-envoye/demande-envoye.component';
import { DemandeFeedbackComponent } from './demande-feedback/demande-feedback.component';
import { FeedbackEnvoyeComponent } from './feedback-envoye/feedback-envoye.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'formulaire',component:FormulaireComponent},
  {path:'home',component:HomeComponent},
  {path:'demandeFeedback',component:DemandeFeedbackComponent},
  {path:'feedbackEnvoye',component:FeedbackEnvoyeComponent},
  {path:'demandeEnvoye',component:DemandeEnvoyeComponent},
  {path:'**',redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
