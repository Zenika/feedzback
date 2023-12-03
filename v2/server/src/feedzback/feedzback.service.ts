import { Injectable } from '@nestjs/common';
import { SendFeedzbackDto } from 'src/feedzback/dto/send-feedzback.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { AskFeedzbackModel } from './models/ask-feedzback.model';

@Injectable()
export class FeedzbackService {
  constructor(private firebaseService: FirebaseService) {}

  async ask(model: AskFeedzbackModel): Promise<{ id: string }> {
    const { id } = await (await this.firebaseService.firestore.collection('feedzback').add(model)).get();
    return { id };
  }

  async getFeedbacks(userEmail: string) {
    const docRefs = await this.firebaseService.firestore
      .collection('feedzback')
      .doc(userEmail)
      .collection('sent')
      .listDocuments();

    return Promise.all(docRefs.map((docRef) => docRef.get())).then((docSnapshots) =>
      docSnapshots.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })),
    );
  }

  sendFeedback(sendFeedback: SendFeedzbackDto & { senderEmail: string }) {
    this.firebaseService.firestore
      .collection('feedzback')
      .doc(sendFeedback.receiverEmail)
      .collection('received')
      .add(sendFeedback);

    if (sendFeedback.senderEmail.includes('@zenika.com')) {
      this.firebaseService.firestore
        .collection('feedzback')
        .doc(sendFeedback.senderEmail)
        .collection('sent')
        .add(sendFeedback);
    }
  }
}
