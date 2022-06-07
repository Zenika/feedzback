import { gql } from 'apollo-server';

export const typeDefs = gql`
type Query{
   sentFeedbacks(email: String!): [Feedback!]!
   receivedFeedbacks(email: String!): [Feedback!]!
   getResult:String
}

type Feedback {
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

type Mutation{
    sendFeedback(feedbackInput: FeedbackInput!):String
    sendFeedbackRequest(askFeedback: AskFeedback!):String
}
`;
