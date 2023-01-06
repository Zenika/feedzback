/** @module getFeedbacks */
import {Datastore, Query} from '@google-cloud/datastore';

const datastore = new Datastore(
    {projectId: 'feedzback-343709'},
);

export const deleteAskOrSentFeedbackById = async (id, tableName) => {
    try {
      /**
       * feedback is the name of the table in datastore
       * as you see we filter feedbacks by key which is the id of each row in the table
       * @type {Query}
       */
      const key = datastore.key([tableName, parseInt(id, 10)]);
      await datastore.delete(key);
      return true
    } catch (err) {
      return false
    }
  };
  