import { Component, ViewEncapsulation } from '@angular/core';
import { LandingComponent } from '../../shared/landing/landing.component';

@Component({
  selector: 'app-landing-demo',
  imports: [LandingComponent],
  templateUrl: './landing-demo.component.html',
  styleUrl: './landing-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LandingDemoComponent {}
