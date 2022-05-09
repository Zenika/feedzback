import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEnvoyeComponent } from './demande-envoye.component';

describe('DemandeEnvoyeComponent', () => {
  let component: DemandeEnvoyeComponent;
  let fixture: ComponentFixture<DemandeEnvoyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeEnvoyeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEnvoyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
