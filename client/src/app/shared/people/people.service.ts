import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { people_v1 } from '@googleapis/people';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const SEARCH_DIRECTORY_PEOPLE_BASE_URL = 'https://people.googleapis.com/v1/people:searchDirectoryPeople';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  search(searchInput: string) {
    const searchUrl = new URL(SEARCH_DIRECTORY_PEOPLE_BASE_URL);
    searchUrl.searchParams.append('mergeSources', 'DIRECTORY_MERGE_SOURCE_TYPE_CONTACT');
    searchUrl.searchParams.append('sources', 'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE');
    searchUrl.searchParams.append('readMask', 'emailAddresses,names,photos');
    searchUrl.searchParams.append('query', searchInput);

    return this.authService.withGoogleBearerToken((headers) =>
      this.httpClient
        .get<people_v1.Schema$SearchDirectoryPeopleResponse>(searchUrl.href, {
          headers,
        })
        .pipe(
          map(
            (result) =>
              result.people?.map(
                (item) =>
                  ({
                    email: item.emailAddresses?.[0].value ?? 'no email',
                    displayName: item.names?.[0].displayName ?? 'no displayname',
                    photoUrl: item.photos?.[0].url ?? undefined,
                  }) ?? [],
              ),
          ),
        ),
    );
  }
}
