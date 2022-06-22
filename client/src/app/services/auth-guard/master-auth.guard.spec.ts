import { TestBed } from '@angular/core/testing';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';
import { authStub } from '../authStub';

import { MasterAuthGuard } from './master-auth.guard';

describe('MasterAuthGuard', () => {
  let guard: MasterAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{provide: AuthService, useValue: authStub}]
    });
    guard = TestBed.inject(MasterAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
