import { Routes } from '@angular/router';
import { DemoComponent } from './demo.component';
import { demoRoutes } from './demo.config';

export default [
  {
    path: '',
    component: DemoComponent,
    children: demoRoutes,
  },
] satisfies Routes;
