import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth, auth } from 'google-auth-library';
import { AppConfig } from 'src/core/config';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './employee-db.config';
import { EmployeeData, EmployeeSearchResult, EmployeeSearchResultList } from './employee-db.types';
import { isEmptyEmployeeData } from './employee-db.utils';

@Injectable()
export class EmployeeDbService {
  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  private get employeeCollection() {
    return this.firebaseService.db.collection(Collection.employee);
  }

  constructor(
    private firebaseService: FirebaseService,
    private configService: ConfigService<AppConfig>,
  ) {}

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async searchEmployee(searchInput: string): Promise<EmployeeSearchResultList> {
    // const sa = this.serviceAccount;

    // // Acquire source credentials:
    // const client = auth.fromJSON(
    //   JSON.parse(
    //     JSON.stringify({
    //       project_id: sa.projectId,
    //       client_email: sa.clientEmail,
    //       private_key: sa.privateKey,
    //     }),
    //   ),
    // );
    // client.setCredentials({access_token:'ya29.a0AfB_byC2uI-6O_pTm4jd-EGo3mP2v_TeU298k6x_Iu2TBamTVV4NXMc2KXzT_ldGR4ogSR7ZwyJ_smOVv0ECbhTH7NPvDzlhjbKbOg_pWST5tHRrzfJXGfgCVBk3UnQfKZpJg_AGpW2OnAYII7eaYUMmh5f3C56ex6KPrjuLwmvH8waCgYKAWESARISFQHGX2Mi_R3RQ4Xv7-OuUVcaHQeV6A0181',
    //    scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly' });
    // console.log('client', client);

    // //auth.defaultScopes = ['https://www.googleapis.com/auth/admin.directory.user.readonly'];

    // const url = `https://admin.googleapis.com/admin/directory/v1/users?customFieldMask=norb&domain=zenika.com&orderBy=email&projection=basic&viewType=domain_public`;
    // const resp = await client.request({ url });
    // for (const bucket of resp.data.items) {
    //   console.log(bucket.name);
    // }

    // Do something with the secret contained in `responsePayload`.
    // const people = google.people('v1');

    // console.log('eeeeeeee',await this.firebaseService.auth.createCustomToken('rrrr'))

    // const a = await people.people.searchDirectoryPeople({
    //   mergeSources: ['DIRECTORY_MERGE_SOURCE_TYPE_CONTACT'],
    //   query: searchInput,
    //   readMask: 'names,emailAddresses',
    //   sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE'],
    //   auth: await this.firebaseService.auth.createCustomToken('rrrr'),
    // });

    // const sa = this.serviceAccount;

    // const { clientEmail, privateKey, projectId } = sa;
    // if (!clientEmail || !privateKey) {
    //   throw new Error(`
    //     The CLIENT_EMAIL and PRIVATE_KEY environment variables are required for
    //     this sample.
    //   `);
    // }

    const sa = this.serviceAccount;
    const auth = new GoogleAuth({
      credentials: {
        client_id : '117030746943285187487',
        client_email: sa.clientEmail,
        private_key: sa.privateKey,
        project_id: sa.projectId,
      },
      scopes: 'https://www.googleapis.com/auth/admin.directory.user.readonly',
    });

    // // console.log('auth', auth);

     const client = await auth.getClient();
 const url = `https://admin.googleapis.com/admin/directory/v1/users?customFieldMask=norb&domain=zenika.com&orderBy=email&projection=basic&viewType=domain_public`;
    const res = await client.request({ url });
    // const client = await authenticate({

    //   scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    // });

    // console.log('token => ', await client.getAccessToken());

    // console.log('client', client);

    // const url = `https://admin.googleapis.com/admin/directory/v1/users?customFieldMask=norb&domain=zenika.com&orderBy=email&projection=basic&viewType=domain_public`;
    // const res = await client.request({ url });
    // console.log('DNS Info:');
    // console.log(res.data);

    // const client = auth.fromJSON(
    //   JSON.parse(
    //     JSON.stringify({
    //       project_id: sa.projectId,
    //       client_email: sa.clientEmail,
    //       private_key: sa.privateKey,
    //     }),
    //   ),
    // );

    // auth.defaultScopes = 'https://www.googleapis.com/auth/directory.readonly';
    // // const aa = await auth.getCredentials()
    // const dd = await client.getAccessToken();

    // const people = google.people('v1');
    // const a = await people.people.searchDirectoryPeople({
    //   mergeSources: ['DIRECTORY_MERGE_SOURCE_TYPE_CONTACT'],
    //   query: searchInput,
    //   readMask: 'names,emailAddresses',
    //   sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE'],
    //   auth: dd.token!,
    // });

    const mockData = {
      data: {
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
      },
    };

    const resultRawData = mockData;

    return resultRawData.data.people!.map<EmployeeSearchResult>(({ names, photos, emailAddresses }) => ({
      displayName: names?.[0].displayName ?? 'Not defined',
      email: emailAddresses?.[0].value ?? 'Not defined',
      photoUrl: photos?.[0].url ?? undefined,
    }));
  }
}
