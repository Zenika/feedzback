import { FactoryProvider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const provideMatPaginatorIntl = (): FactoryProvider => ({
  provide: MatPaginatorIntl,
  useFactory: () => {
    const intl = new MatPaginatorIntl();
    intl.itemsPerPageLabel = '';
    intl.previousPageLabel = $localize`:@@Action.PreviousPage:Page précédente`;
    intl.nextPageLabel = $localize`:@@Action.NextPage:Page suivante`;
    return intl;
  },
});
