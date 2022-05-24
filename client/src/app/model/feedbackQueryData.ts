export class FeedbackQueryData {
    constructor(
        public senderName: String = "",
        public senderEmail: String = "",
        public receverEmail: String = "",
        public receverName: String = "",
        public positiveFeedback: String = "",
        public toImprove: String = "",
        public comment: String = "",
    ) { }
}