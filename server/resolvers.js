const sendEmail = require('./sendEmail');
const getEmail = require('./getEmail');
const { Datastore } = require("@google-cloud/datastore");

const resolvers = {
    Query: {
        allMessage:  () =>  getEmail()
           
    },
    Mutation: {
        createMessage: (_,payload)=> sendEmail(payload)
    }
}
module.exports = resolvers;