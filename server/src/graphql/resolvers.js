import {sendEmail} from '../services/sendEmail.js';
import {getEmail} from '../services/getEmail.js';


export const resolvers = {
  Query: {
    allMessage: () => getEmail(),
  },
  Mutation: {
    createMessage: async (_, payload)=> await sendEmail(payload),
  },
};

