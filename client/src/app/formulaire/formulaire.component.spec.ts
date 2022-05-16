import { ComponentFixture, TestBed,waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormulaireComponent } from './formulaire.component';
import { Apollo } from 'apollo-angular';
import {  FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';


describe('FormuleComponent', () => {
  let component:FormulaireComponent;
  let fixture:ComponentFixture<FormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[Apollo],
      declarations: [ FormulaireComponent
       ],
       imports:[FormsModule,
        RouterTestingModule,
        ApolloTestingModule],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(FormulaireComponent);
    component = fixture.debugElement.componentInstance;
  fixture.detectChanges();
    
  });



  it('should create', waitForAsync(() => {
    component.onSubmit()
    expect(component).toBeTruthy();
  }));

  it('formulaire est pas valide quand il est vide',waitForAsync(()=>{

  expect(component.feedbackForm.valid).toBeFalsy();
    
    }));
  it('champs Votre nom est requis',waitForAsync(()=>{
   let name = component.feedbackForm.controls['nom'];
    expect(name.valid).toBeFalsy();
  }))
  it('champs Votre nom est valide quand il est remplis',waitForAsync(()=>{
    let name = component.feedbackForm.controls['nom'];
    name.setValue("Pompidore Pierre")
     expect(name.valid).toBeTruthy();
   }))

   it('champs Votre Email est requis',waitForAsync(()=>{
    let email = component.feedbackForm.controls['email'];
     expect(email.valid).toBeFalsy();
   }))
   it('champs Votre Email est valide quand il est remplis',waitForAsync(()=>{
     let email = component.feedbackForm.controls['email'];
     email.setValue("pierre.henry@example.com")
      expect(email!.valid).toBeTruthy();
    }))

    it('champs Email Zenika de votre collègue est requis',waitForAsync(()=>{
      let senderEmail = component.feedbackForm.controls['receverEmail'];
       expect(senderEmail.valid).toBeFalsy();
     }))
     it('champs Email Zenika de votre collègue est valide quand il est remplis',waitForAsync(()=>{
       let senderEmail = component.feedbackForm.controls['receverEmail'];
       senderEmail.setValue("marie.mettrand@example.com")
        expect(senderEmail.valid).toBeTruthy();
      }))

    it('champs points positifs est requis',waitForAsync(()=>{
      let pointsPositifs = component.feedbackForm.controls['pointsPositifs'];
       expect(pointsPositifs.valid).toBeFalsy();
     }))
     it('champs points positifs est valide quand il est remplis',waitForAsync(()=>{
       let pointsPositifs = component.feedbackForm.controls['pointsPositifs'];
       pointsPositifs.setValue("les points positifs:.....")
        expect(pointsPositifs.valid).toBeTruthy();
      }))

      it('champs axes ameliorations positifs est requis',waitForAsync(()=>{
        let axesAmeliorations = component.feedbackForm.controls['axesAmeliorations'];
         expect(axesAmeliorations.valid).toBeFalsy();
       }))
       it('champs axes ameliorations est valide quand il est remplis',waitForAsync(()=>{
         let axesAmeliorations = component.feedbackForm.controls['axesAmeliorations'];
         axesAmeliorations.setValue("les axes ameliorations:.....")
          expect(axesAmeliorations.valid).toBeTruthy();
        }))

   it('Formulaire doit être valide quand tous les champs sont valides',waitForAsync(()=>{
    let nom = component.feedbackForm.controls['nom'];
    nom.setValue("Pompidor Pierre")

    let email = component.feedbackForm.controls['email'];
    email.setValue("pierre.pompidor@example.com")

    let receverEmail = component.feedbackForm.controls['receverEmail'];
    receverEmail.setValue("marie.mettrand@example.com")

    let pointsPositifs = component.feedbackForm.controls['pointsPositifs'];
    pointsPositifs.setValue("les points positifs:.....")

    let axesAmeliorations = component.feedbackForm.controls['axesAmeliorations'];
    axesAmeliorations.setValue("les axes ameliorations:.....")

     expect(component.feedbackForm.valid).toBeTruthy();
   }))
 
});
