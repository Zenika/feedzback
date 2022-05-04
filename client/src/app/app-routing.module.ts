import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandeFeedbackComponent } from './demande-feedback/demande-feedback.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'formulaire',component:FormulaireComponent},
  {path:'home',component:HomeComponent},
  {path:'demandeFeedback',component:DemandeFeedbackComponent},
  {path:'**',redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
