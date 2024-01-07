import { FactoryProvider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const provideMatPaginatorIntl = (): FactoryProvider => ({
  provide: MatPaginatorIntl,
  useFactory: () => {
    const intl = new MatPaginatorIntl();
    intl.itemsPerPageLabel = '';
    intl.previousPageLabel = $localize`:@@Shared.Action.PreviousPage:Page précédente`;
    intl.nextPageLabel = $localize`:@@Shared.Action.NextPage:Page suivante`;
    return intl;
  },
});
