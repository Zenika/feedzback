import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async get() {
    return (
      await this.firebaseService.firestore
        .collection('hello')
        .doc('world')
        .set({ ok: true })
    );
  }
}
