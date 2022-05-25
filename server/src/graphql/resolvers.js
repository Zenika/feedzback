import { getFeedbacks } from '../services/getFeedbacks.js';
import { askFeedback } from '../services/askFeedback.js';
import { sendFeedback } from '../services/sendFeedback.js'


export const resolvers = {
  Query: {
    feedbacks: (_, {email}) => getFeedbacks(email),
  },
  Mutation: {
    sendFeedback: async (_, payload) => await sendFeedback(payload),
    sendFeedbackRequest: async (_, request) => await askFeedback(request)
  },
};

