const { Datastore } = require("@google-cloud/datastore");

const datastore = new Datastore(
  {projectId:'feedzback-343709'}
);
const getVisits = ()=>{
const query = datastore
    .createQuery('inbox');
  return datastore.runQuery(query);
}
module.exports= async()=>{
  
  try {
  const  [entities] =   await getVisits();
  if(entities){
  const emails = entities.map(
entity => `email: ${entity.email} , message: ${entity.message}`);  
  console.log('bnyad' + emails[0]);
const msg = {
  email:emails[0].email,
  message:emails[0].message

}
  return  entities[0];
}
  } catch(err){
    return err;
  }

}

