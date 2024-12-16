import { Routes } from '@angular/router';
import { managerDocumentResolver } from './manager-document/manager-document.resolver';
import { MANAGER_LIST_ROOT } from './manager-list/manager-list.config';
import { managerListResolver } from './manager-list/manager-list.resolver';

export const managerRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `list/${MANAGER_LIST_ROOT}`,
  },
  {
    path: 'list/:managedEmail',
    loadComponent: () => import('./manager-list/manager-list.component'),
    resolve: { list: managerListResolver },
    title: 'FeedZback - ' + $localize`:@@Title.SharedFeedbackList:Liste des feedZbacks partagés`,
  },
  {
    path: 'document/:feedbackId',
    loadComponent: () => import('./manager-document/manager-document.component'),
    resolve: { document: managerDocumentResolver },
    title: 'FeedZback - ' + $localize`:@@Title.SharedFeedbackDetails:Détails du FeedZback partagé`,
  },
];

export default managerRoutes;
