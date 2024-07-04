import { Directive } from '@angular/core';

// Note: this directive adds the relevant CSS class `gbl-landing` (and its random BEM modifier) to an Angular component
// (more infos: src/styles/landing.scss)

@Directive({
  selector: '[appLanding]',
  host: {
    '[class]': 'hostClass',
  },
  standalone: true,
})
export class LandingDirective {
  private readonly randomAnimIndex = Math.random() < 0.5 ? 1 : 2;

  // According to CSS BEM convention, `gbl-landing` is a Block and for example `gbl-landing--anim-1` is a Modifier
  protected hostClass = `gbl-landing gbl-landing--anim-${this.randomAnimIndex}`;
}
