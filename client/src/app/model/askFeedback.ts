export class AskFeedback {
  constructor(
      public id: string,
      public token: string,
      public senderName: string = '',
      public senderEmail: string = '',
      public receverName: string = '',
      public receverEmail: string = '',
      public text: string = '',
      public createdAt: string = '',
      public lastResendDate: string = '',
  ) {}
}
