import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuard, AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';
import { authStub } from '../authStub';

import { MasterAuthGuard } from './master-auth.guard';

describe('MasterAuthGuard', () => {
  let guard: MasterAuthGuard;
  const firebaseAuthGuardStub = {
    canActivate: () => jest.fn()
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
                AngularFireAuthGuardModule],
      providers: [{provide: AuthService, useValue: authStub},
                  { provide: AngularFireAuthGuard, useValue: firebaseAuthGuardStub}]       
    });
    guard = TestBed.inject(MasterAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
