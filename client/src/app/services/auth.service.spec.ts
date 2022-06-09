import { TestBed } from '@angular/core/testing';
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
      imports: [RouterTestingModule],
      providers: [{provide: AuthService, useValue: authStub}]
    });
    service = TestBed.inject(AuthService)

  });
  it('The service is created',()=>{
    expect(service).toBeTruthy();

  })

});
