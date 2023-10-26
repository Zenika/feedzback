import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-layout>
      <app-header appLayoutHeader></app-header>
      <router-outlet appLayoutMain></router-outlet>
      <app-footer appLayoutFooter></app-footer>
    </app-layout>
  `,
})
export class AppComponent {}
