/** @module Resolvers */
import {getSentFeedbacks, getReceivedFeedbacks, getFeedbackById} from '../services/getFeedbacks.js';
import {askFeedback} from '../services/askFeedback.js';
import {sendFeedback} from '../services/sendFeedback.js';
import {deleteAskOrSentFeedbackById} from '../services/deleteAskSendFeedbacks.js'

export const feedbackTable = 'feedzback';
export const askFeedbackTable = 'askFeedzback'
/**
 * Thank to graphql reslover we can call http requests here
 * Alos we can retreive data from different sources, howerver it's not the case here still,
  */
export const resolvers = {
  Query: {
    sentFeedbacks: (_, {email}) => getSentFeedbacks(email, feedbackTable),
    receivedFeedbacks: (_, {email}) => getReceivedFeedbacks(email, feedbackTable),
    sentAskFeedbacks: (_, {email}) => getSentFeedbacks(email, askFeedbackTable),
    receivedAskFeedbacks: (_, {email}) => getReceivedFeedbacks(email, askFeedbackTable),
    getFeedbackById: (_, {id}) => getFeedbackById(id, feedbackTable),
  },
  Mutation: {
    sendFeedback: async (_, payload) => await sendFeedback(payload),
    sendFeedbackRequest: async (_, request) => await askFeedback(request),
    deleteAskFeedbackById: async (_, {id}) => await deleteAskOrSentFeedbackById(id, askFeedbackTable),
  },
};
