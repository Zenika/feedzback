import { FactoryProvider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const provideMatPaginatorIntl = (): FactoryProvider => ({
  provide: MatPaginatorIntl,
  useFactory: () => {
    const intl = new MatPaginatorIntl();
    intl.itemsPerPageLabel = '';
    intl.previousPageLabel = $localize`:@@previousPage:Page précédente`;
    intl.nextPageLabel = $localize`:@@nextPage:Page suivante`;
    return intl;
  },
});
