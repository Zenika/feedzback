const {Datastore} = require('@google-cloud/datastore');

const datastore = new Datastore(
    {projectId: 'feedzback-343709'},
);
const getVisits = ()=>{
  const query = datastore.createQuery('inbox');
  return datastore.runQuery(query);
};
module.exports= async ()=>{
  try {
    const [entities] = await getVisits();
    if (entities) return entities[0];
  } catch (err) {
    return err;
  }
};

