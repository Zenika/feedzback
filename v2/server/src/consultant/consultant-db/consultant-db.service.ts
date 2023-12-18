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

  async getAndSetIfNotExists(consultantEmail: string) {
    const doc = await this.consultantCollection.doc(consultantEmail).get();
    if (doc.exists) {
      return doc.data() as ConsultantData;
    }

    const consultantData: ConsultantData = {
      managerEmail: '',
      managedEmails: [],
    };
    await this.consultantCollection.doc(consultantEmail).set(consultantData);
    return consultantData;
  }

  async updateManager(consultantEmail: string, managerEmail: string) {
    const consultantDoc = await this.getAndSetIfNotExists(consultantEmail);

    const currentManagerEmail = consultantDoc.managerEmail;
    if (currentManagerEmail && currentManagerEmail !== managerEmail) {
      await this.getAndSetIfNotExists(currentManagerEmail);
      await this.setManagedForExistingConsultant(currentManagerEmail, consultantEmail, 'remove');
    }

    await this.setManagerForExistingConsultant(consultantEmail, managerEmail);

    await this.getAndSetIfNotExists(managerEmail);
    await this.setManagedForExistingConsultant(managerEmail, consultantEmail, 'add');
  }

  private async setManagerForExistingConsultant(consultantEmail: string, managerEmail: string) {
    const consultantDoc = await this.consultantCollection.doc(consultantEmail).get();
    if (consultantDoc.exists) {
      throw new Error();
    }
    const partialConsultantData: Partial<ConsultantData> = {
      managerEmail,
    };
    await this.consultantCollection.doc(consultantEmail).update(partialConsultantData);
  }

  private async setManagedForExistingConsultant(
    consultantEmail: string,
    managedEmail: string,
    action: 'add' | 'remove',
  ) {
    const consultantDoc = await this.consultantCollection.doc(consultantEmail).get();
    if (consultantDoc.exists) {
      throw new Error();
    }
    const { managedEmails } = consultantDoc.data() as ConsultantData;

    // Implementation (1)
    const newManagedEmails = managedEmails.filter((_managedEmail) => _managedEmail !== managedEmail);
    if (action === 'add') {
      newManagedEmails.push(managedEmail);
    }
    newManagedEmails.sort();

    const partialConsultantData: Partial<ConsultantData> = {
      managedEmails: newManagedEmails,
    };
    await this.consultantCollection.doc(consultantEmail).update(partialConsultantData);

    /*
    // Implementation (2)
    const managedEmailIndex = managedEmails.indexOf(managedEmail);
    if (action === 'add' && managedEmailIndex === -1) {
      managedEmails.push(managedEmail);
      managedEmails.sort();
    } else if (action === 'remove' && managedEmailIndex !== -1) {
      managedEmails.splice(managedEmailIndex, 1);
    } else {
      return;
    }

    const partialConsultantData: Partial<ConsultantData> = {
      managedEmails,
    };
    await this.consultantCollection.doc(consultantEmail).update(partialConsultantData);
    */
  }
}
