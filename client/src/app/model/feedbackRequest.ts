export class FeedbackRequest {
  constructor(
    public token: string,
    public senderName: string = '',
    public senderEmail: string = '',
    public receverName: string = '',
    public receverEmail: string = '',
    public text: string = '',
    public createdAt: string = '',
  ) {}
}
