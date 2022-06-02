export class Feedback {
    constructor(
        public senderName: string = "",
        public senderEmail: string = "",
        public receverEmail: string = "",
        public receverName: string = "",
        public positiveFeedback: string = "",
        public toImprove: string = "",
        public comment: string = "",
        public createdAt: string = "",
    ) { }
}