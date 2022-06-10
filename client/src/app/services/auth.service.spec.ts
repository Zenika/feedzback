import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { authStub } from './authStub';


describe('AuthService', () => {
  let service: AuthService;


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
