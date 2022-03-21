const {gql} = require('apollo-server');

const typeDefs = gql`
type Query{
   allMessage: Message
}
type Message {
    email: String
    message: String
}
type Mutation{
    createMessage(email:String!,message:String!):Message
    
}
`;
module.exports = typeDefs;
