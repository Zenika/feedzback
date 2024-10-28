import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { ORDERED_STATS_TABS, STATS_TAB_PARAM } from './stats-tab';

export const statsGuard: CanActivateFn = (route) => {
  if (ORDERED_STATS_TABS.includes(route.params[STATS_TAB_PARAM])) {
    return true;
  }
  return new RedirectCommand(inject(Router).parseUrl('/stats'));
};
