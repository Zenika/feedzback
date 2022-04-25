const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.API_KEY);
const server = new ApolloServer({typeDefs, resolvers, introspection: true,
  playground: true});
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = parseInt(process.env.PORT) || 4000;
server.start().then(()=>{
  server.applyMiddleware({app}),
  app.listen({
    port: PORT},
  ()=> {
    console.log('Now browse to http://localhost:4000' + server.graphqlPath);
  },
  );
});

