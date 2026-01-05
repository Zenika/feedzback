import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { PreRequestSuccessComponent } from './pre-request-success/pre-request-success.component';
import { PreRequestTokenSuccessComponent } from './pre-request-token-success/pre-request-token-success.component';
import { PreRequestTokenComponent } from './pre-request-token/pre-request-token.component';
import { PreRequestComponent } from './pre-request.component';

const preRequestRoutes: Routes = [
  {
    path: '',
    component: PreRequestComponent,
    canActivate: [authGuard],
  },
  {
    path: 'success',
    component: PreRequestSuccessComponent,
    canActivate: [authGuard],
  },
  {
    path: 'token/:token',
    component: PreRequestTokenComponent,
  },
  {
    path: 'token-success',
    component: PreRequestTokenSuccessComponent,
  },
];

export default preRequestRoutes;
