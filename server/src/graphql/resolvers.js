import {sendEmail} from '../services/sendEmail.js';
import {getEmail} from '../services/getEmail.js';
import { askFeedback } from '../services/askFeedback.js';


export const resolvers = {
  Query: {
    allMessage: () => getEmail(),
  },
  Mutation: {
    sendFeedback: async (_, payload)=> await sendEmail(payload),
    sendFeedbackRequest : async(_,request)=> await askFeedback(request)
  },
};

