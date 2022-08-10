import { Datastore } from '@google-cloud/datastore';

const datastore = new Datastore(
  { projectId: 'feedzback-343709' },
);

export const getReceivedFeedbacks = async (email) => {
  try {
    const query = datastore.createQuery('feedzback').filter('receverEmail', '=', email);
    const [entities] = await datastore.runQuery(query);
    const res = combineEntityAndKey(entities);
    return res
  } catch (err) {
    return err;
  }
};

export const getSentFeedbacks = async (email) => {
  try {
    const query = datastore.createQuery('feedzback').filter('senderEmail', '=', email);
    let [entities] = await datastore.runQuery(query);
    const res = combineEntityAndKey(entities);
    return res;
  } catch (err) {
    return err;
  }

};


export const getFeedbackById = async (id) => {
  try {
    const key = datastore.key(['feedzback', parseInt(id,10)])
    const query = datastore.createQuery('feedzback').filter('__key__', '=', key);
    const [[entity]] = await datastore.runQuery(query);
    return entity;
  } catch (err) {
    return err;
  }
};

export const combineEntityAndKey = (entities) => {
   let list = [];
   for(let i=0;i<entities.length;i++)
   {
    const res = Object.assign(entities[i],entities[i][datastore.KEY])
    list.push(res)
   }
   return list;
}
