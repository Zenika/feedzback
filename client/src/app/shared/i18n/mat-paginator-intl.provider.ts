import { FactoryProvider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const provideMatPaginatorIntl = (): FactoryProvider => ({
  provide: MatPaginatorIntl,
  useFactory: () => {
    const intl = new MatPaginatorIntl();
    intl.itemsPerPageLabel = '';
    intl.previousPageLabel = $localize`:@@Common.Page.Previous:Page précédente`;
    intl.nextPageLabel = $localize`:@@Common.Page.Next:Page suivante`;
    return intl;
  },
});
