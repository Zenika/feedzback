import { getSentFeedbacks, getReceivedFeedbacks, getFeedbackById } from '../services/getFeedbacks.js';
import { askFeedback } from '../services/askFeedback.js';
import { sendFeedback } from '../services/sendFeedback.js'

export const resolvers = {
  Query: {
    sentFeedbacks: (_, {email}) => getSentFeedbacks(email),
    receivedFeedbacks: (_, {email}) => getReceivedFeedbacks(email),
    getFeedbackById: (_,{id}) => getFeedbackById(id)
  },
  Mutation: {
    sendFeedback: async (_, payload) => await sendFeedback(payload),
    sendFeedbackRequest: async (_, request) => await askFeedback(request)
  },
};
