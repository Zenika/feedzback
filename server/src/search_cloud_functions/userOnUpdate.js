import * as algoliasearch from 'algoliasearch';
import * as functions from 'firebase-functions';
export const userOnUpdate = functions.firestore
   .document('users/{id}')
   .onCreate(async (change, context) => {
       const user = change.data();
       const client = algoliasearch('appId', 'apiKey');
       const index = client.initIndex('dev_users');
       return index.partialUpdateObject({
           objectID: change.id,
           ...user
       });
   });