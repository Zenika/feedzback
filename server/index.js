import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {typeDefs} from './src/graphql/typeDefs.js';
import {resolvers} from './src/graphql/resolvers.js';
import cors from 'cors';
import admin from 'firebase-admin'
import {createRequire} from 'module'
import dotEnv from 'dotenv'

const server = new ApolloServer({typeDefs, resolvers, introspection: true,
  playground: true});
const app = express();

const require = createRequire(import.meta.url);
if (process.env.NODE_ENV !== 'production') {
  dotEnv.config()
}
const serviceFirebaseAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceFirebaseAccountKey)
})

app.use("*",cors());
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
