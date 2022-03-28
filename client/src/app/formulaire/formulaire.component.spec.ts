import { ComponentFixture, TestBed,waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormulaireComponent } from './formulaire.component';
import { Apollo, ApolloModule } from 'apollo-angular';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';


describe('FormuleComponent', () => {
  let component:FormulaireComponent;
  let fixture:ComponentFixture<FormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[Apollo,FormBuilder],
      declarations: [ FormulaireComponent,
       ],
       imports:[FormsModule,
      ApolloTestingModule],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(FormulaireComponent);
    component = fixture.debugElement.componentInstance;
    component.ngOnInit();
    
  });



  it('should create', waitForAsync(() => {
    component.onSubmit()
    expect(component).toBeTruthy();
  }));

  it('formulaire est pas valide quand il est vide',waitForAsync(()=>{
  expect(component.form.valid).toBeFalsy();
  }));
  it('champs email est requis',waitForAsync(()=>{
   let email = component.form.controls['email'];
    expect(email.valid).toBeFalsy();
  }))
  it('champs email est valide quand il est remplis',waitForAsync(()=>{
    let email = component.form.controls['email'];
    email.setValue("binyat@gmail.com")
     expect(email.valid).toBeTruthy();
   }))
   it('Formulaire doit être valide quand tous les champs sont valides',waitForAsync(()=>{
    let email = component.form.controls['email'];
    email.setValue("binyat@gmail.com")
     expect(component.form.valid).toBeTruthy();
   }))
});
