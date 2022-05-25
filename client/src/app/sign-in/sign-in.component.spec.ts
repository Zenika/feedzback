import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  let authStub = {
    constructor: () => {console.log('constructor called')},
    oAuthProvider: () => {console.log('login called')},
    signInWithGoogle: () => {console.log('logout called')},
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [RouterTestingModule,
        AngularFireAuthModule],
        providers: [{ provide: AuthService, useValue: authStub}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
