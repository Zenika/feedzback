import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './consultant-db.config';
import { ConsultantData } from './consultant-db.types';
import { isEmptyConsultantData } from './consultant-db.utils';

@Injectable()
export class ConsultantDbService {
  private db = this.firebaseService.db;

  private get consultantCollection() {
    return this.db.collection(Collection.consultant);
  }

  constructor(private firebaseService: FirebaseService) {}

  async get(consultantEmail: string) {
    const consultantDoc = await this.consultantCollection.doc(consultantEmail).get();
    if (consultantDoc.exists) {
      return consultantDoc.data() as ConsultantData;
    }
    return null;
  }

  async updateManager(consultantEmail: string, newManagerEmail: string) {
    const consultantDoc = await this.get(consultantEmail);

    const oldManagerEmail = consultantDoc?.managerEmail;
    if (oldManagerEmail === newManagerEmail) {
      return;
    }
    if (oldManagerEmail) {
      await this.updateManagedEmailsField(oldManagerEmail, consultantEmail, 'remove');
    }

    await this.updateManagerEmailField(consultantEmail, newManagerEmail);

    await this.updateManagedEmailsField(newManagerEmail, consultantEmail, 'add');
  }

  private async updateManagerEmailField(consultantEmail: string, managerEmail: string) {
    const partialConsultantData: Partial<ConsultantData> = {
      managerEmail,
    };
    await this.consultantCollection.doc(consultantEmail).set(partialConsultantData, { merge: true });
  }

  private async updateManagedEmailsField(consultantEmail: string, managedEmail: string, action: 'add' | 'remove') {
    const oldConsultantData = await this.get(consultantEmail);

    const managedEmails = (oldConsultantData?.managedEmails ?? []).filter((email) => email !== managedEmail);
    if (action === 'add') {
      managedEmails.push(managedEmail);
      managedEmails.sort();
    }

    const newConsultantData: ConsultantData = { ...oldConsultantData, managedEmails };
    const consultantDoc = this.consultantCollection.doc(consultantEmail);

    if (isEmptyConsultantData(newConsultantData)) {
      await consultantDoc.delete();
    } else {
      await consultantDoc.set(newConsultantData);
    }
  }
}
