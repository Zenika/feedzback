import { Injectable } from '@nestjs/common';
import { SendFeedbackDto } from 'src/feedzback/dto/send-feedback.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FeedzbackService {
  constructor(private firebaseService: FirebaseService) {}

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

  sendFeedback(sendFeedback: SendFeedbackDto & { senderEmail: string }) {
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
