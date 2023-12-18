import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { UpdateManagerDto } from './consultant.dto';
import { ConsultantData } from './consultant.types';

@Injectable({
  providedIn: 'root',
})
export class ConsultantService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  private _data = signal<ConsultantData>({ managerEmail: '', managedEmails: [] });

  data = computed(() => this._data());

  isManager = computed(() => this._data().managedEmails.length > 0);

  fetchData() {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<ConsultantData>(`${this.apiBaseUrl}/consultant`, { headers }).pipe(
        tap((data) => this._data.set(data)),
        map(() => undefined),
      ),
    );
  }

  updateManager(managerEmail: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.post(`${this.apiBaseUrl}/consultant/manager`, { managerEmail } as UpdateManagerDto, { headers }),
    );
  }
}
