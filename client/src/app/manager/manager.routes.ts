import { Routes } from '@angular/router';
import { managerDocumentResolver } from './manager-document/manager-document.resolver';

export const managerRoutes: Routes = [
  {
    path: 'list/:managedEmail',
    loadComponent: () => import('./manager-list/manager-list.component'),
  },
  {
    path: 'document/:feedbackId',
    loadComponent: () => import('./manager-document/manager-document.component'),
    resolve: { document: managerDocumentResolver },
  },
];

export default managerRoutes;
