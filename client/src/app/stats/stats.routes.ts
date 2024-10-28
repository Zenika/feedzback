import { Routes } from '@angular/router';
import { STATS_TAB_PARAM } from './stats-tab';
import { StatsComponent } from './stats.component';
import { statsGuard } from './stats.guard';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/stats/summary',
  },
  {
    path: `:${STATS_TAB_PARAM}`,
    component: StatsComponent,
    canActivate: [statsGuard],
    title: 'FeedZback - Stats',
  },
] satisfies Routes;
