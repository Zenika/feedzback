const express = require('express');

const bodyParser = require('body-parser');
const {ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const {Datastore} = require('@google-cloud/datastore');
const crypto = require('crypto');
const { visit } = require('graphql');

 
const datastore = new Datastore({
projectId: 'feedzback-343709',
});

const insertVisit = visit => {
    return datastore.save({
        key: datastore.key('visit'),
        data:visit,
    });
};
const getVisits = () => {
    const query = datastore
      .createQuery('inbox');
  
    return datastore.runQuery(query);
  };
  
const server = new ApolloServer({ typeDefs, resolvers,introspection: true,
    playground: true, });
const app = express();



app.use('/hello',async (req,res)=> {
    try {
        const [entities] = await getVisits();
        const visits = entities.map(
          entity => `Time: ${entity.email}, AddrHash: ${entity.message}`
        );
      
        res
          .status(200)
          .set('Content-Type', 'text/plain')
          .send(`Last 10 visits:\n${visits.join('\n')}`)
          .end();
      } catch (error) {
        next(error);
      }
});

app.get('/set' , async (req,res,next)=> {
    const visit = {
        timtestamp :new Date(),
        userIp: crypto.
        createHash('sha256')
        .update(req.ip)
        .digest('hex'),

    };
try {
    await insertVisit(visit);
    res.status(200)
    .set('Content-Type' , 'text/plain')
    .send('Last 10 visits:').end();
} catch(error){
    next(error);
}
});
const PORT = parseInt(process.env.PORT) || 4000;
server.start().then(()=>{
    server.applyMiddleware({app}),
    app.listen({
        port:PORT
    },()=>  {
          console.log('Now browse to http://localhost:4000' 
          + server.graphqlPath)})

     });

// server.start().then(res=>{

//     app.listen({port:3000},()=>
//     console.log('Now browse to http://localhost:4000' + server.graphqlPath)
//     )});

