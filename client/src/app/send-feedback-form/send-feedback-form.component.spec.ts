/* eslint-disable dot-notation */
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Apollo} from 'apollo-angular';
import {ReactiveFormsModule} from '@angular/forms';
import {SendFeedbackFormComponent} from './send-feedback-form.component';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {authStub} from '../services/authStub';

describe('SendFeedbackFormComponent', () => {
  let component: SendFeedbackFormComponent;
  let fixture: ComponentFixture<SendFeedbackFormComponent>;
  // eslint-disable-next-line no-unused-vars
  let service: AuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Apollo, {provide: AuthService, useValue: authStub}],

      declarations: [SendFeedbackFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        ApolloTestingModule,
        AngularFireAuthModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(SendFeedbackFormComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(AuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    component.onSubmit();
    expect(component).toBeTruthy();
  }));

  it('formulaire est pas valide quand il est vide', waitForAsync(() => {
    expect(component.form.valid).toBeFalsy();
  }));

  it('champs Nom Zenika de votre collègue est requis', waitForAsync(() => {
    const name = component.form.controls['receverName'];
    expect(name.valid).toBeFalsy();
  }));

  it('champs Nom Zenika de votre collègue est valide quand il est remplis', waitForAsync(() => {
    const name = component.form.controls['receverName'];
    name.setValue('Pompidore Pierre');
    expect(name.valid).toBeTruthy();
  }));

  it('champs Email Zenika de votre collègue est requis', waitForAsync(() => {
    const senderEmail = component.form.controls['receverEmail'];
    expect(senderEmail.valid).toBeFalsy();
  }));

  it('champs Email Zenika de votre collègue est valide quand il est remplis', waitForAsync(() => {
    const senderEmail = component.form.controls['receverEmail'];
    senderEmail.setValue('marie.mettrand@example.com');
    expect(senderEmail.valid).toBeTruthy();
  }));

  it('champs Votre Email est invalide', waitForAsync(() => {
    const email = component.form.controls['receverEmail'];
    email.setValue('salut');
    expect(email!.valid).toBeFalsy();
  }));

  it('champs points positifs est requis', waitForAsync(() => {
    const pointsPositifs = component.form.controls['postitiveFeedback'];
    expect(pointsPositifs.valid).toBeFalsy();
  }));

  it('champs points positifs est valide quand il est remplis', waitForAsync(() => {
    const pointsPositifs = component.form.controls['postitiveFeedback'];
    pointsPositifs.setValue('les points positifs:.....');
    expect(pointsPositifs.valid).toBeTruthy();
  }));

  it('champs axes ameliorations positifs est requis', waitForAsync(() => {
    const axesAmeliorations = component.form.controls['toImproveFeedback'];
    expect(axesAmeliorations.valid).toBeFalsy();
  }));

  it('champs axes ameliorations est valide quand il est remplis', waitForAsync(() => {
    const axesAmeliorations = component.form.controls['toImproveFeedback'];
    axesAmeliorations.setValue('les axes ameliorations:.....');
    expect(axesAmeliorations.valid).toBeTruthy();
  }));

  it('Formulaire doit être valide quand tous les champs sont valides', waitForAsync(() => {
    const receverName = component.form.controls['receverName'];
    receverName.setValue('Pompidor Pierre');

    const receverEmail = component.form.controls['receverEmail'];
    receverEmail.setValue('marie.mettrand@example.com');

    const pointsPositifs = component.form.controls['postitiveFeedback'];
    pointsPositifs.setValue('les points positifs:.....');

    const axesAmeliorations = component.form.controls['toImproveFeedback'];
    axesAmeliorations.setValue('les axes ameliorations:.....');

    expect(component.form.valid).toBeTruthy();
  }));
});
