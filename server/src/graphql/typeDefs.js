import { gql } from 'apollo-server';

export const typeDefs = gql`
type Query{
   sentFeedbacks(email: String!): [Feedback!]!
   receivedFeedbacks(email: String!): [Feedback!]!
   getFeedbackById(id: String!): Feedback!
   getResult:String
}

type Feedback {
    id: String
    senderName: String
    senderEmail: String
    receverEmail: String
    receverName: String
    positiveFeedback: String
    toImprove: String
    comment: String
    createdAt: String
}
input FeedbackInput {
    token:String
    senderName:String
    senderEmail:String
    receverEmail: String
    receverName: String
    positiveFeedback:String
    toImprove:String
    comment:String
}
input AskFeedback {
    token:String
    name: String!
    email: String!
    senderName: String!
    senderEmail: String!
    text: String
}
type SendResult {
    feedbackId: String
    message: String!
}

type Mutation{
    sendFeedback(feedbackInput: FeedbackInput!): SendResult
    sendFeedbackRequest(askFeedback: AskFeedback!): String
}
`;
