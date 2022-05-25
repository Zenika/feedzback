import { Datastore } from '@google-cloud/datastore';

const datastore = new Datastore(
  { projectId: 'feedzback-343709' },
);

export const getFeedbacks = async (email) => {
  try {
    const query = datastore.createQuery('feedzback').filter('receverEmail', '=', email);
    const [entities] = await datastore.runQuery(query);
    return entities;
  } catch (err) {
    return err;
  }
};
