/**
 * HACK:
 * The feedback `context` field might be `undefined` because it was added later to its interface.
 * Therefore, existing feedbacks don't have it.
 */
export const applyFeedbackContextHack = (feedback: { context?: string }) => {
  if (feedback.context === undefined) {
    feedback.context = '';
  }
};
