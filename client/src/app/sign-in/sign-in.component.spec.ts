import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  let authStub = {
    constructor: () => {console.log('constructor called')},
    oAuthProvider: () => {console.log('login called')},
    signInWithGoogle: () => {console.log('logout called')},
    signOut: () => {console.log('sign out!')}
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [RouterTestingModule],
        providers: [{ provide: AuthService, useValue: authStub}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
