import { gql } from 'apollo-server';

export const typeDefs = gql`
type Query{
   allMessage: Message
   getResult: String
}
type Message {
    email: String
    to:String
    message: String
}
input SendRequest {
    token: String
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
    sendFeedback(sendRequest:SendRequest!):String
    sendFeedbackRequest(askFeedback: AskFeedback!):String
}
`;
