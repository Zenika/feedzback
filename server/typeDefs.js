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
type Mutation{
    createMessage(email:String!,to:String!,message:String!):String
    
}
`;
module.exports = typeDefs;
