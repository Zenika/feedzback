import { FactoryProvider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const provideMatPaginatorIntl = (): FactoryProvider => ({
  provide: MatPaginatorIntl,
  useFactory: () => {
    const intl = new MatPaginatorIntl();
    intl.itemsPerPageLabel = '';
    intl.previousPageLabel = 'Page précédente';
    intl.nextPageLabel = 'Page suivante';
    return intl;
  },
  deps: [
    /* Injection translation module when this feature will be available */
  ],
});
