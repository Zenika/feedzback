import * as algoliaSearch from 'algoliasearch';
import * as functions from 'firebase-functions';

export const userOnCreate = functions.firestore
.document('users/{id}')
.onCreate(async (change, context) => {
    const user = change.data();
    const client = algoliaSearch('appId', 'apiKey');
    const index = client.initIndex('dev_users');
    await index.setSettings({
        replicas: [
            'dev_users'
        ]
    })
}
)