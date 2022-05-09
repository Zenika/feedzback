import {Datastore} from '@google-cloud/datastore';

const datastore = new Datastore(
    {projectId: 'feedzback-343709'},
);
const getEmails = ()=>{
  const query = datastore.createQuery('inbox');
  return datastore.runQuery(query);
};
export const getEmail= async ()=>{
  try {
    const [entities] = await getEmails();
    if (entities) return entities[0];
  } catch (err) {
    return err;
  }
};
