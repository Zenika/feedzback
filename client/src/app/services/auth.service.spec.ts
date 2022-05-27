import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';


describe('AuthService', () => {
  let service: AuthService;
  let authStub = {
    constructor: () => {console.log('constructor called')},
    oAuthProvider: () => {console.log('login called')},
    signInWithGoogle: () => {console.log('logout called')},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
      AngularFireAuthModule],
      providers: [{provide: AuthService, useValue: authStub}]
    });
    service = TestBed.inject(AuthService)

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
