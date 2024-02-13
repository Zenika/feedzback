import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private httpClient = inject(HttpClient);

  readonly clientAppVersion = environment.appVersion;

  serverAppVersion?: string;

  private _versionsMismatch = signal<boolean | undefined>(undefined);

  versionsMismatch = this._versionsMismatch.asReadonly();

  constructor() {
    this.httpClient.get<{ appVersion: string }>(`${environment.apiBaseUrl}/version`).subscribe((server) => {
      this.serverAppVersion = server.appVersion;
      this._versionsMismatch.set(this.serverAppVersion !== this.clientAppVersion);
    });
  }
}
