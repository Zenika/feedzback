/** @module graphqlschema */
import {gql} from 'apollo-server';

/**
 * Define all graphql schemas
 */
export const typeDefs = gql`
type Query{
   sentFeedbacks(email: String!): [Feedback!]!
   receivedFeedbacks(email: String!): [Feedback!]!
   sentAskFeedbacks(email: String!): [AskFeedback!]!
   receivedAskFeedbacks(email: String!): [AskFeedback!]!
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
type AskFeedback {
    id: String
    senderName: String
    senderEmail: String
    receverEmail: String
    receverName: String
    text: String
    createdAt: String
    lastResendDate: String
    isDone: Boolean
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
input AskFeedbackInput {
    token:String
    senderName: String!
    senderEmail: String!
    receverEmail: String!
    receverName: String!
    text: String
    createdAt: String
    lastResendDate: String
}
type SendResult {
    feedbackId: String
    message: String!
}

type Mutation {
    sendFeedback(feedbackInput: FeedbackInput!): SendResult
    sendFeedbackRequest(askFeedbackInput: AskFeedbackInput!): SendResult
    deleteAskFeedbackById(id: String!): Boolean
}
`;
