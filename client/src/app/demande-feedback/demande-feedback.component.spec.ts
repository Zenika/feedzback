import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Apollo } from 'apollo-angular';

import { DemandeFeedbackComponent } from './demande-feedback.component';

describe('DemandeFeedbackComponent', () => {
  let component: DemandeFeedbackComponent;
  let fixture: ComponentFixture<DemandeFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Apollo],
      declarations: [ DemandeFeedbackComponent ],
      imports: [RouterTestingModule,
      FormsModule,
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
