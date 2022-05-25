import { TestBed } from '@angular/core/testing';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
      AngularFireAuthModule]
    });
    
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
