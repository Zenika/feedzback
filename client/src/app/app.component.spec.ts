import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {AuthService} from './services/auth.service';
import {authStub} from './services/authStub';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AngularFireAuthModule],
      providers: [{provide: AuthService, useValue: authStub}],
      declarations: [AppComponent],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });
});
