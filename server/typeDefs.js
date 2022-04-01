const {gql} = require('apollo-server');

const typeDefs = gql`
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
    email:String
    nom:String
    pointsPositifs:String
    axesAmeliorations:String
    commentaire:String
}

type Mutation{
    createMessage(email:String!,message:SendRequest!):String
    
}
`;
module.exports = typeDefs;
