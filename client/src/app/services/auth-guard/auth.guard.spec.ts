import {TestBed} from '@angular/core/testing';
import {
  AngularFireAuthGuard,
  AngularFireAuthGuardModule,
} from '@angular/fire/compat/auth-guard';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../auth.service';
import {authStub} from '../authStub';

import {AuthGuard} from './auth.guard';

describe('MasterAuthGuard', () => {
  let guard: AuthGuard;
  const firebaseAuthGuardStub = {
    canActivate: () => jest.fn(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AngularFireAuthGuardModule],
      providers: [
        {provide: AuthService, useValue: authStub},
        {provide: AngularFireAuthGuard, useValue: firebaseAuthGuardStub},
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
