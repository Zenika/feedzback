import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  readonly clientAppVersion = environment.appVersion;

  private serverAppVersion?: string;

  private httpClient = inject(HttpClient);

  private apiBaseUrl = environment.apiBaseUrl;

  init(): Promise<string> {
    return firstValueFrom(
      this.httpClient.get<{ appVersion: string }>(`${this.apiBaseUrl}/version`).pipe(
        map(({ appVersion }) => appVersion),
        tap((serverAppVersion) => (this.serverAppVersion = serverAppVersion)),
      ),
    );
  }

  get serverVersionMatches() {
    return this.serverAppVersion === this.clientAppVersion;
  }
}
