const sendEmail = require('./sendEmail');
const getEmail = require('./getEmail');


const resolvers = {
    Query: {
        allMessage:  () =>  getEmail(),
        getResult: ()=> global.result
           
    },
    Mutation: {
        createMessage: async(_,payload)=> await sendEmail(payload)
    }
}
module.exports = resolvers;