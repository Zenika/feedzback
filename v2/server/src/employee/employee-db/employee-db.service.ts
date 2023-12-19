import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './employee-db.config';
import { EmployeeData } from './employee-db.types';
import { isEmptyEmployeeData } from './employee-db.utils';

@Injectable()
export class EmployeeDbService {
  private db = this.firebaseService.db;

  private get employeeCollection() {
    return this.db.collection(Collection.employee);
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
}
