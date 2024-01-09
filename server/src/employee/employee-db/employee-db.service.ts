import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './employee-db.config';
import { EmployeeData, EmployeeSearchResult, EmployeeSearchResultList } from './employee-db.types';
import { isEmptyEmployeeData } from './employee-db.utils';

@Injectable()
export class EmployeeDbService {
  private get employeeCollection() {
    return this.firebaseService.db.collection(Collection.employee);
  }

  constructor(private firebaseService: FirebaseService) {}

  async get(employeeEmail: string) {
    const employeeDoc = await this.employeeCollection.doc(employeeEmail).get();
    if (employeeDoc.exists) {
      return employeeDoc.data() as EmployeeData;
    }
    return null;
  }

  async updateManager(employeeEmail: string, newManagerEmail: string) {
    const employeeDoc = await this.get(employeeEmail);

    const oldManagerEmail = employeeDoc?.managerEmail;
    if (oldManagerEmail === newManagerEmail) {
      return;
    }
    if (oldManagerEmail) {
      await this.updateManagedEmailsField(oldManagerEmail, employeeEmail, 'remove');
    }

    await this.updateManagerEmailField(employeeEmail, newManagerEmail);

    await this.updateManagedEmailsField(newManagerEmail, employeeEmail, 'add');
  }

  private async updateManagerEmailField(employeeEmail: string, managerEmail: string) {
    const partialEmployeeData: Partial<EmployeeData> = {
      managerEmail,
    };
    await this.employeeCollection.doc(employeeEmail).set(partialEmployeeData, { merge: true });
  }

  private async updateManagedEmailsField(employeeEmail: string, managedEmail: string, action: 'add' | 'remove') {
    const oldEmployeeData = await this.get(employeeEmail);

    const managedEmails = (oldEmployeeData?.managedEmails ?? []).filter((email) => email !== managedEmail);
    if (action === 'add') {
      managedEmails.push(managedEmail);
      managedEmails.sort();
    }

    const newEmployeeData: EmployeeData = { ...oldEmployeeData, managedEmails };
    const employeeDoc = this.employeeCollection.doc(employeeEmail);

    if (isEmptyEmployeeData(newEmployeeData)) {
      await employeeDoc.delete();
    } else {
      await employeeDoc.set(newEmployeeData);
    }
  }

  async searchEmployee(searchInput: string): Promise<EmployeeSearchResultList> {
    const auth = await google.auth.fromAPIKey('AIzaSyA3wUYWtxb_5ebghHlNCBXmJRsvpcH4qj0');
    const people = google.people('v1');
    const a = await people.people.searchDirectoryPeople({
      mergeSources: ['DIRECTORY_MERGE_SOURCE_TYPE_CONTACT'],
      query: searchInput,
      readMask: 'names,emailAddresses',
      sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE'],
      auth,
    });

    const mockData = {
      people: [
        {
          resourceName: 'people/114580241791076969822',
          etag: '%EggBAgMJLjc9PhoDAQIHIgw3R2lBNElaTFFjST0=',
          names: [
            {
              metadata: {
                primary: true,
                source: {
                  type: 'DOMAIN_PROFILE',
                  id: '114580241791076969822',
                },
              },
              displayName: 'Norbert POINTU',
              familyName: 'POINTU',
              givenName: 'Norbert',
              displayNameLastFirst: 'Norbert POINTU',
              unstructuredName: 'Norbert POINTU',
            },
          ],
          emailAddresses: [
            {
              metadata: {
                primary: true,
                verified: true,
                source: {
                  type: 'DOMAIN_PROFILE',
                  id: '114580241791076969822',
                },
                sourcePrimary: true,
              },
              value: 'norbert.pointu@zenika.com',
            },
          ],
        },
        {
          resourceName: 'people/101834802401175303872',
          etag: '%EggBAgMJLjc9PhoDAQIH',
          names: [
            {
              metadata: {
                primary: true,
                source: {
                  type: 'PROFILE',
                  id: '101834802401175303872',
                },
                sourcePrimary: true,
              },
              displayName: 'Norbert Jeff Nadir',
              familyName: 'Nadir',
              givenName: 'Norbert Jeff',
              displayNameLastFirst: 'Nadir, Norbert Jeff',
              unstructuredName: 'Norbert Jeff Nadir',
            },
          ],
          photos: [
            {
              metadata: {
                primary: true,
                source: {
                  type: 'PROFILE',
                  id: '101834802401175303872',
                },
              },
              url: 'https://lh3.googleusercontent.com/a-/ALV-UjXQWYXlCeSwcj7XCIn8f8rCy6HzkSGlwXRA6d1RcIgUMw=s100',
            },
          ],
          emailAddresses: [
            {
              metadata: {
                primary: true,
                verified: true,
                source: {
                  type: 'DOMAIN_PROFILE',
                  id: '101834802401175303872',
                },
                sourcePrimary: true,
              },
              value: 'norbertjeff.nadir@zenika.com',
            },
          ],
        },
      ],
      totalSize: 2,
    };

    const resultRawData = a;

    return resultRawData.data.people!.map<EmployeeSearchResult>(({ names, photos, emailAddresses }) => ({
      displayName: names?.[0].displayName ?? 'Not defined',
      email: emailAddresses?.[0].value ?? 'Not defined',
      photoUrl: photos?.[0].url ?? undefined,
    }));
  }
}
