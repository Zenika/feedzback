import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { Versions } from './versions.types';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private serverAppVersionResource = httpResource<{ appVersion: string }>(`${environment.apiBaseUrl}/version`);

  versions = computed<Versions>(() => {
    const client = environment.appVersion;

    const server = this.serverAppVersionResource.value()?.appVersion;
    if (server === undefined) {
      return { client };
    }

    return { client, server, mismatch: client !== server };
  });
}
