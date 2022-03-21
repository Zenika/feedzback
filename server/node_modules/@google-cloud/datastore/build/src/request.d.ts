/*!
 * Copyright 2014 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="node" />
import { google } from '../protos/protos';
import { CallOptions } from 'google-gax';
import { Duplex, Transform } from 'stream';
export interface AbortableDuplex extends Duplex {
    abort(): void;
}
import { entity, Entity, EntityProto, Entities } from './entity';
import { Query, QueryProto, RunQueryOptions, RunQueryResponse, RunQueryCallback } from './query';
import { Datastore } from '.';
/**
 * Handle logic for Datastore API operations. Handles request logic for
 * Datastore.
 *
 * Creates requests to the Datastore endpoint. Designed to be inherited by
 * the {@link Datastore} and {@link Transaction} classes.
 *
 * @class
 */
declare class DatastoreRequest {
    id: string | undefined;
    requests_: Entity | {
        mutations: Array<{}>;
    };
    requestCallbacks_: Array<(err: Error | null, resp: Entity | null) => void> | Entity;
    datastore: Datastore;
    [key: string]: Entity;
    /**
     * Format a user's input to mutation methods. This will create a deep clone of
     * the input, as well as allow users to pass an object in the format of an
     * entity.
     *
     * Both of the following formats can be supplied supported:
     *
     *     datastore.save({
     *       key: datastore.key('Kind'),
     *       data: { foo: 'bar' }
     *     }, (err) => {})
     *
     *     const entity = { foo: 'bar' }
     *     entity[datastore.KEY] = datastore.key('Kind')
     *     datastore.save(entity, (err) => {})
     *
     * @internal
     *
     * @see {@link https://github.com/GoogleCloudPlatform/google-cloud-node/issues/1803}
     *
     * @param {object} obj The user's input object.
     */
    static prepareEntityObject_(obj: Entity): PrepareEntityObjectResponse;
    /**
     * Generate IDs without creating entities.
     *
     * @param {Key} key The key object to complete.
     * @param {number|object} options Either the number of IDs to allocate or an
     *     options object for further customization of the request.
     * @param {number} options.allocations How many IDs to allocate.
     * @param {object} [options.gaxOptions] Request configuration options, outlined
     *     here: https://googleapis.github.io/gax-nodejs/global.html#CallOptions.
     * @param {function} callback The callback function.
     * @param {?error} callback.err An error returned while making this request
     * @param {array} callback.keys The generated IDs
     * @param {object} callback.apiResponse The full API response.
     *
     * @example
     * ```
     * const incompleteKey = datastore.key(['Company']);
     *
     * //-
     * // The following call will create 100 new IDs from the Company kind, which
     * // exists under the default namespace.
     * //-
     * datastore.allocateIds(incompleteKey, 100, (err, keys) => {});
     *
     * //-
     * // Or, if you're using a transaction object.
     * //-
     * const transaction = datastore.transaction();
     *
     * transaction.run((err) => {
     *   if (err) {
     *     // Error handling omitted.
     *   }
     *
     *   transaction.allocateIds(incompleteKey, 100, (err, keys) => {
     *     if (err) {
     *       // Error handling omitted.
     *     }
     *
     *     transaction.commit((err) => {
     *       if (!err) {
     *         // Transaction committed successfully.
     *       }
     *     });
     *   });
     * });
     *
     * //-
     * // You may prefer to create IDs from a non-default namespace by providing
     * an
     * // incomplete key with a namespace. Similar to the previous example, the
     * call
     * // below will create 100 new IDs, but from the Company kind that exists
     * under
     * // the "ns-test" namespace.
     * //-
     * const incompleteKey = datastore.key({
     *   namespace: 'ns-test',
     *   path: ['Company']
     * });
     *
     * function callback(err, keys, apiResponse) {}
     *
     * datastore.allocateIds(incompleteKey, 100, callback);
     *
     * //-
     * // Returns a Promise if callback is omitted.
     * //-
     * datastore.allocateIds(incompleteKey, 100).then((data) => {
     *   const keys = data[0];
     *   const apiResponse = data[1];
     * });
     * ```
     */
    allocateIds(key: entity.Key, options: AllocateIdsOptions | number): Promise<AllocateIdsResponse>;
    allocateIds(key: entity.Key, options: AllocateIdsOptions | number, callback: AllocateIdsCallback): void;
    /**
     * Retrieve the entities as a readable object stream.
     *
     * @throws {Error} If at least one Key object is not provided.
     *
     * @param {Key|Key[]} keys Datastore key object(s).
     * @param {object} [options] Optional configuration. See {@link Datastore#get}
     *     for a complete list of options.
     *
     * @example
     * ```
     * const keys = [
     *   datastore.key(['Company', 123]),
     *   datastore.key(['Product', 'Computer'])
     * ];
     *
     * datastore.createReadStream(keys)
     *   .on('error', (err) =>  {})
     *   .on('data', (entity) => {
     *     // entity is an entity object.
     *   })
     *   .on('end', () => {
     *     // All entities retrieved.
     *   });
     * ```
     */
    createReadStream(keys: Entities, options?: CreateReadStreamOptions): Transform;
    /**
     * Delete all entities identified with the specified key(s).
     *
     * @param {Key|Key[]} key Datastore key object(s).
     * @param {object} [gaxOptions] Request configuration options, outlined here:
     *     https://googleapis.github.io/gax-nodejs/global.html#CallOptions.
     * @param {function} callback The callback function.
     * @param {?error} callback.err An error returned while making this request
     * @param {object} callback.apiResponse The full API response.
     *
     * @example
     * ```
     * const key = datastore.key(['Company', 123]);
     * datastore.delete(key, (err, apiResp) => {});
     *
     * //-
     * // Or, if you're using a transaction object.
     * //-
     * const transaction = datastore.transaction();
     *
     * transaction.run((err) => {
     *   if (err) {
     *     // Error handling omitted.
     *   }
     *
     *   transaction.delete(key);
     *
     *   transaction.commit((err) => {
     *     if (!err) {
     *       // Transaction committed successfully.
     *     }
     *   });
     * });
     *
     * //-
     * // Delete multiple entities at once.
     * //-
     * datastore.delete([
     *   datastore.key(['Company', 123]),
     *   datastore.key(['Product', 'Computer'])
     * ], (err, apiResponse) => {});
     *
     * //-
     * // Returns a Promise if callback is omitted.
     * //-
     * datastore.delete().then((data) => {
     *   const apiResponse = data[0];
     * });
     * ```
     */
    delete(keys: Entities, gaxOptions?: CallOptions): Promise<DeleteResponse>;
    delete(keys: Entities, callback: DeleteCallback): void;
    delete(keys: Entities, gaxOptions: CallOptions, callback: DeleteCallback): void;
    /**
     * Retrieve the entities identified with the specified key(s) in the current
     * transaction. Get operations require a valid key to retrieve the
     * key-identified entity from Datastore.
     *
     * @throws {Error} If at least one Key object is not provided.
     *
     * @param {Key|Key[]} keys Datastore key object(s).
     * @param {object} [options] Optional configuration.
     * @param {string} [options.consistency] Specify either `strong` or `eventual`.
     *     If not specified, default values are chosen by Datastore for the
     *     operation. Learn more about strong and eventual consistency
     *     [here](https://cloud.google.com/datastore/docs/articles/balancing-strong-and-eventual-consistency-with-google-cloud-datastore).
     * @param {object} [options.gaxOptions] Request configuration options, outlined
     *     here: https://googleapis.github.io/gax-nodejs/global.html#CallOptions.
     * @param {boolean | IntegerTypeCastOptions} [options.wrapNumbers=false]
     *     Wrap values of integerValue type in {@link Datastore#Int} objects.
     *     If a `boolean`, this will wrap values in {@link Datastore#Int} objects.
     *     If an `object`, this will return a value returned by
     *     `wrapNumbers.integerTypeCastFunction`.
     *     Please see {@link IntegerTypeCastOptions} for options descriptions.
     * @param {function} callback The callback function.
     * @param {?error} callback.err An error returned while making this request
     * @param {object|object[]} callback.entity The entity object(s) which match
     *     the provided keys.
     *
     * @example
     * ```
     * //-
     * // Get a single entity.
     * //-
     * const key = datastore.key(['Company', 123]);
     *
     * datastore.get(key, (err, entity) => {});
     *
     * //-
     * // Or, if you're using a transaction object.
     * //-
     * const transaction = datastore.transaction();
     *
     * transaction.run((err) => {
     *   if (err) {
     *     // Error handling omitted.
     *   }
     *
     *   transaction.get(key, (err, entity) => {
     *     if (err) {
     *       // Error handling omitted.
     *     }
     *
     *     transaction.commit((err) => {
     *       if (!err) {
     *         // Transaction committed successfully.
     *       }
     *     });
     *   });
     * });
     *
     * //-
     * // Get multiple entities at once with a callback.
     * //-
     * const keys = [
     *   datastore.key(['Company', 123]),
     *   datastore.key(['Product', 'Computer'])
     * ];
     *
     * datastore.get(keys, (err, entities) => {});
     *
     * //-
     * // Below is how to update the value of an entity with the help of the
     * // `save` method.
     * //-
     * datastore.get(key, (err, entity) => {
     *   if (err) {
     *     // Error handling omitted.
     *   }
     *
     *   entity.newValue = true;
     *
     *   datastore.save({
     *     key: key,
     *     data: entity
     *   }, (err) => {});
     * });
     *
     * //-
     * // Returns a Promise if callback is omitted.
     * //-
     * datastore.get(keys).then((data) => {
     *   const entities = data[0];
     * });
     * ```
     */
    get(keys: entity.Key | entity.Key[], options?: CreateReadStreamOptions): Promise<GetResponse>;
    get(keys: entity.Key | entity.Key[], callback: GetCallback): void;
    get(keys: entity.Key | entity.Key[], options: CreateReadStreamOptions, callback: GetCallback): void;
    /**
     * Datastore allows you to query entities by kind, filter them by property
     * filters, and sort them by a property name. Projection and pagination are
     * also supported.
     *
     * The query is run, and the results are returned as the second argument to
     * your callback. A third argument may also exist, which is a query object
     * that uses the end cursor from the previous query as the starting cursor for
     * the next query. You can pass that object back to this method to see if more
     * results exist.
     * @param {Query} query Query object.
     * @param {object} [options] Optional configuration.
     * @param {string} [options.consistency] Specify either `strong` or `eventual`.
     *     If not specified, default values are chosen by Datastore for the
     *     operation. Learn more about strong and eventual consistency
     *     [here](https://cloud.google.com/datastore/docs/articles/balancing-strong-and-eventual-consistency-with-google-cloud-datastore).
     * @param {object} [options.gaxOptions] Request configuration options, outlined
     *     here: https://googleapis.github.io/gax-nodejs/global.html#CallOptions.
     * @param {boolean | IntegerTypeCastOptions} [options.wrapNumbers=false]
     *     Wrap values of integerValue type in {@link Datastore#Int} objects.
     *     If a `boolean`, this will wrap values in {@link Datastore#Int} objects.
     *     If an `object`, this will return a value returned by
     *     `wrapNumbers.integerTypeCastFunction`.
     *     Please see {@link IntegerTypeCastOptions} for options descriptions.
     * @param {function} [callback] The callback function. If omitted, a readable
     *     stream instance is returned.
     * @param {?error} callback.err An error returned while making this request
     * @param {object[]} callback.entities A list of entities.
     * @param {object} callback.info An object useful for pagination.
     * @param {?string} callback.info.endCursor Use this in a follow-up query to
     *     begin from where these results ended.
     * @param {string} callback.info.moreResults Datastore responds with one of:
     *
     *     - {@link Datastore#MORE_RESULTS_AFTER_LIMIT}: There *may* be more
     *       results after the specified limit.
     *     - {@link Datastore#MORE_RESULTS_AFTER_CURSOR}: There *may* be more
     *       results after the specified end cursor.
     *     - {@link Datastore#NO_MORE_RESULTS}: There are no more results.
     *
     * @example
     * ```
     * //-
     * // Where you see `transaction`, assume this is the context that's relevant
     * to
     * // your use, whether that be a Datastore or a Transaction object.
     * //-
     * const query = datastore.createQuery('Lion');
     *
     * datastore.runQuery(query, (err, entities, info) => {
     *   // entities = An array of records.
     *
     *   // Access the Key object for an entity.
     *   const firstEntityKey = entities[0][datastore.KEY];
     * });
     *
     * //-
     * // Or, if you're using a transaction object.
     * //-
     * const transaction = datastore.transaction();
     *
     * transaction.run((err) => {
     *   if (err) {
     *     // Error handling omitted.
     *   }
     *
     *   transaction.runQuery(query, (err, entities) => {
     *     if (err) {
     *       // Error handling omitted.
     *     }
     *
     *     transaction.commit((err) => {
     *       if (!err) {
     *         // Transaction committed successfully.
     *       }
     *     });
     *   });
     * });
     *
     * //-
     * // A keys-only query returns just the keys of the result entities instead
     * of
     * // the entities themselves, at lower latency and cost.
     * //-
     * const keysOnlyQuery = datastore.createQuery('Lion').select('__key__');
     *
     * datastore.runQuery(keysOnlyQuery, (err, entities) => {
     *   const keys = entities.map((entity) => {
     *     return entity[datastore.KEY];
     *   });
     * });
     *
     * //-
     * // Returns a Promise if callback is omitted.
     * //-
     * datastore.runQuery(query).then((data) => {
     *   const entities = data[0];
     * });
     * ```
     */
    runQuery(query: Query, options?: RunQueryOptions): Promise<RunQueryResponse>;
    runQuery(query: Query, options: RunQueryOptions, callback: RunQueryCallback): void;
    runQuery(query: Query, callback: RunQueryCallback): void;
    /**
     * Get a list of entities as a readable object stream.
     *
     * See {@link Datastore#runQuery} for a list of all available options.
     *
     * @param {Query} query Query object.
     * @param {object} [options] Optional configuration.
     * @param {object} [options.gaxOptions] Request configuration options, outlined
     *     here: https://googleapis.github.io/gax-nodejs/global.html#CallOptions.
     *
     * @example
     * ```
     * datastore.runQueryStream(query)
     *   .on('error', console.error)
     *   .on('data', (entity) => {
     *     // Access the Key object for this entity.
     *     const key = entity[datastore.KEY];
     *   })
     *   .on('info', (info) => {})
     *   .on('end', () => {
     *     // All entities retrieved.
     *   });
     *
     * //-
     * // If you anticipate many results, you can end a stream early to prevent
     * // unnecessary processing and API requests.
     * //-
     * datastore.runQueryStream(query)
     *   .on('data', (entity) => {
     *     this.end();
     *   });
     * ```
     */
    runQueryStream(query: Query, options?: RunQueryStreamOptions): Transform;
    /**
     * Merge the specified object(s). If a key is incomplete, its associated object
     * is inserted and the original Key object is updated to contain the generated ID.
     * For example, if you provide an incomplete key (one without an ID),
     * the request will create a new entity and have its ID automatically assigned.
     * If you provide a complete key, the entity will be get the data from datastore
     * and merge with the data specified.
     * By default, all properties are indexed. To prevent a property from being
     * included in *all* indexes, you must supply an `excludeFromIndexes` array.
     *
     * Maps to {@link Datastore#save}, forcing the method to be `upsert`.
     *
     * @param {object|object[]} entities Datastore key object(s).
     * @param {Key} entities.key Datastore key object.
     * @param {string[]} [entities.excludeFromIndexes] Exclude properties from
     *     indexing using a simple JSON path notation. See the examples in
     *     {@link Datastore#save} to see how to target properties at different
     *     levels of nesting within your entity.
     * @param {object} entities.data Data to merge to the same for provided key.
     * @param {function} callback The callback function.
     * @param {?error} callback.err An error returned while making this request
     * @param {object} callback.apiResponse The full API response.
     */
    merge(entities: Entities): Promise<CommitResponse>;
    merge(entities: Entities, callback: SaveCallback): void;
    /**
     * @private
     */
    prepareGaxRequest_(config: RequestConfig, callback: Function): void;
    /**
     * Make a request to the API endpoint. Properties to indicate a transactional
     * or non-transactional operation are added automatically.
     *
     * @param {object} config Configuration object.
     * @param {object} config.gaxOpts GAX options.
     * @param {string} config.client The name of the gax client.
     * @param {function} config.method The gax method to call.
     * @param {object} config.reqOpts Request options.
     * @param {function} callback The callback function.
     *
     * @private
     */
    request_(config: RequestConfig, callback: RequestCallback): void;
    /**
     * Make a request as a stream.
     *
     * @param {object} config Configuration object.
     * @param {object} config.gaxOpts GAX options.
     * @param {string} config.client The name of the gax client.
     * @param {string} config.method The gax method to call.
     * @param {object} config.reqOpts Request options.
     */
    requestStream_(config: RequestConfig): AbortableDuplex;
}
export interface ConsistencyProtoCode {
    [key: string]: number;
}
export declare type AllocateIdsResponse = [entity.Key[], google.datastore.v1.IAllocateIdsResponse];
export interface AllocateIdsCallback {
    (a: Error | null, b: entity.Key[] | null, c: google.datastore.v1.IAllocateIdsResponse): void;
}
export interface AllocateIdsOptions {
    allocations?: number;
    gaxOptions?: CallOptions;
}
export declare type CreateReadStreamOptions = RunQueryOptions;
export interface GetCallback {
    (err?: Error | null, entity?: Entities): void;
}
export declare type GetResponse = [Entities];
export interface Mutation {
    [key: string]: EntityProto;
}
export interface PrepareEntityObject {
    [key: string]: google.datastore.v1.Key | undefined;
}
export interface PrepareEntityObjectResponse {
    key?: google.datastore.v1.Key;
    data?: google.datastore.v1.Entity;
    method?: string;
}
export interface RequestCallback {
    (a?: Error | null, b?: any): void;
}
export interface RequestConfig {
    client: string;
    gaxOpts?: CallOptions;
    method: string;
    prepared?: boolean;
    reqOpts?: RequestOptions;
}
export interface RequestOptions {
    mutations?: google.datastore.v1.IMutation[];
    keys?: Entity;
    readOptions?: {
        readConsistency?: number;
        transaction?: string;
    };
    partitionId?: google.datastore.v1.IPartitionId | null;
    transactionOptions?: {
        readOnly?: {};
        readWrite?: {
            previousTransaction?: string;
        };
    } | null;
    transaction?: string | null;
    mode?: string;
    projectId?: string;
    query?: QueryProto;
    filter?: string;
    indexId?: string;
    entityFilter?: google.datastore.admin.v1.IEntityFilter;
}
export declare type RunQueryStreamOptions = RunQueryOptions;
export interface CommitCallback {
    (err?: Error | null, resp?: google.datastore.v1.ICommitResponse): void;
}
export declare type CommitResponse = [google.datastore.v1.ICommitResponse];
export declare type SaveCallback = CommitCallback;
export declare type SaveResponse = CommitResponse;
export declare type DeleteCallback = CommitCallback;
export declare type DeleteResponse = CommitResponse;
/**
 * Reference to the {@link DatastoreRequest} class.
 * @name module:@google-cloud/datastore.DatastoreRequest
 * @see DatastoreRequest
 */
export { DatastoreRequest };
