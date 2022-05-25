import { gql } from 'apollo-server';

export const typeDefs = gql`
type Query{
   feedbacks(email: String!): [Feedback!]!
   getResult:String
}

type Feedback {
    senderName: String
    senderEmail: String
    positiveFeedback: String
    toImprove: String
    comment: String
}
input SendRequest {
    senderName:String
    senderEmail:String
    receverEmail: String
    receverName: String
    positiveFeedback:String
    toImprove:String
    comment:String
}
input AskFeedback {
    name: String!
    email: String!
    senderName: String!
    senderEmail: String!
    text: String
}

type Mutation{
    sendFeedback(sendRequest:SendRequest!):String
    sendFeedbackRequest(askFeedback: AskFeedback!):String
}
`;
