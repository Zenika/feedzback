import { Injectable } from '@nestjs/common';
import { SendFeedbackDto } from 'src/feedback/feedback.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { AskFeedback } from './feedback.types';

@Injectable()
export class FeedbackService {
  constructor(private firebaseService: FirebaseService) {}

  async ask(model: AskFeedback): Promise<{ id: string }> {
    const { id } = await (await this.firebaseService.firestore.collection('feedback').add(model)).get();
    return { id };
  }

  async getFeedbacks(userEmail: string) {
    const docRefs = await this.firebaseService.firestore
      .collection('feedback')
      .doc(userEmail)
      .collection('sent')
      .listDocuments();

    return Promise.all(docRefs.map((docRef) => docRef.get())).then((docSnapshots) =>
      docSnapshots.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })),
    );
  }

  sendFeedback(sendFeedback: SendFeedbackDto & { senderEmail: string }) {
    this.firebaseService.firestore
      .collection('feedback')
      .doc(sendFeedback.receiverEmail)
      .collection('received')
      .add(sendFeedback);

    if (sendFeedback.senderEmail.includes('@zenika.com')) {
      this.firebaseService.firestore
        .collection('feedback')
        .doc(sendFeedback.senderEmail)
        .collection('sent')
        .add(sendFeedback);
    }
  }
}
