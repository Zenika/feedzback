import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './consultant-db.config';
import { ConsultantData } from './consultant-db.types';

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
    const consultantDoc = await this.consultantCollection.doc(consultantEmail).get();

    const currentManagedEmails = (consultantDoc.exists && (consultantDoc.data() as ConsultantData).managedEmails) || [];

    const managedEmails = currentManagedEmails.filter((_managedEmail) => _managedEmail !== managedEmail);
    if (action === 'add') {
      managedEmails.push(managedEmail);
      managedEmails.sort();
    }

    const partialConsultantData: Partial<ConsultantData> = {
      managedEmails,
    };
    await this.consultantCollection.doc(consultantEmail).set(partialConsultantData, { merge: true });
  }
}
