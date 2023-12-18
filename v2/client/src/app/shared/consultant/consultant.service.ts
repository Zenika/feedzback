import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

  get() {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<ConsultantData>(`${this.apiBaseUrl}/consultant`, {
        headers,
      }),
    );
  }

  updateManager(managerEmail: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.post(`${this.apiBaseUrl}/consultant/manager`, { managerEmail } as UpdateManagerDto, { headers }),
    );
  }
}
