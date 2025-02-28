import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { Versions } from './versions.types';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  // FIXME: missing to send context `BYPASS_AUTHORIZATION_CONTEXT`
  // Feature NOT yet available for `httpResource` in Angular v19.2
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
