import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ALLOWED_EMAIL_DOMAINS } from '../../shared/form/allowed-email-domains';
import { FeedbackDraftStubService } from './feedback-draft.stub.service';
import { FeedbackDraftService } from './feedback-draft/feedback-draft.service';
import { GiveFeedbackComponent } from './give-feedback.component';

fdescribe('GiveFeedbackComponent', () => {
  let component: GiveFeedbackComponent;
  let fixture: ComponentFixture<GiveFeedbackComponent>;
  let allowedEmailDomains: string[];
  let buttons: HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveFeedbackComponent, RouterTestingModule, HttpClientModule, NoopAnimationsModule],
      providers: [
        {
          provide: ALLOWED_EMAIL_DOMAINS,
          useValue: 'label.com',
        },
        {
          provide: FeedbackDraftService,
          useClass: FeedbackDraftStubService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GiveFeedbackComponent);
    component = fixture.componentInstance;
    buttons = Array.from(fixture.nativeElement.querySelectorAll('button'));

    TestBed.runInInjectionContext(() => {
      allowedEmailDomains = inject(ALLOWED_EMAIL_DOMAINS);
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve data from FeedbackDraftService', () => {
    expect(component.form.controls['receiverEmail'].value).toBe('receiverEmail');
    expect(component.form.controls['positive'].value).toBe('positive');
    expect(component.form.controls['negative'].value).toBe('negative');
    expect(component.form.controls['comment'].value).toBe('comment');
    expect(component.form.controls['shared'].value).toBe(true);
  });

  it('should have buttons "Envoyer/Enregistrer" disabled and an error "email", when email is invalid', () => {
    component.submitInProgress = false;
    fixture.detectChanges();

    const buttonEnregistrer = buttons.find((button) => button.textContent?.includes('Enregistrer'));
    expect(buttonEnregistrer?.getAttribute('disabled')).toBeTruthy();

    const buttonEnvoyer = buttons.find((button) => button.textContent?.includes('Envoyer'));
    expect(buttonEnvoyer?.getAttribute('disabled')).toBeTruthy();

    expect(component.form.controls['receiverEmail'].errors?.['email']).toBeTruthy();
  });

  it('should have buttons "Envoyer/Enregistrer" enabled and no error "email", when email is valid', () => {
    component.submitInProgress = false;
    component.form.controls['receiverEmail'].setValue(`test@${allowedEmailDomains}`);
    fixture.detectChanges();

    const buttonEnregistrer = buttons.find((button) => button.textContent?.includes('Enregistrer'));
    expect(buttonEnregistrer?.getAttribute('disabled')).toBeFalsy();

    const buttonEnvoyer = buttons.find((button) => button.textContent?.includes('Envoyer'));
    expect(buttonEnvoyer?.getAttribute('disabled')).toBeFalsy();

    expect(component.form.controls['receiverEmail'].errors?.['email']).toBeFalsy();
  });

  it('should have an error "required", when email is empty', () => {
    component.submitInProgress = false;
    component.form.controls['receiverEmail'].setValue('');

    expect(component.form.controls['receiverEmail'].errors?.['required']).toBeTruthy();
  });
});
