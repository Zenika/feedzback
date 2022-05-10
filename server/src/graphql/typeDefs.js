import {gql}  from 'apollo-server';

export const typeDefs = gql`
type Query{
   allMessage: Message
   getResult:String
}
type Message {
    email: String
    to:String
    message: String
}
input SendRequest {
    nom:String
    email:String
    receverEmail: String
    receverName: String
    pointsPositifs:String
    axesAmeliorations:String
    commentaire:String
}
input AskFeedback {
    name: String!
    email: String!
    senderName: String!
    senderEmail: String!
    text: String
}

type Mutation{
    createMessage(sendRequest:SendRequest!):String
    sendFeedbackRequest(askFeedback: AskFeedback!):String
    
}
`;
