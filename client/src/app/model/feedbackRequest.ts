export class FeedbackRequest {
    constructor(
        public name: string = '',
        public email: string = '',
        public senderName: string = '',
        public senderEmail: string = '',
        public text: string = ''
    ) { }
}