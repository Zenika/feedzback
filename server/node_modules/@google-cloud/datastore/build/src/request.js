"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreRequest = void 0;
const promisify_1 = require("@google-cloud/promisify");
const arrify = require("arrify");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const concat = require('concat-stream');
const extend = require("extend");
const split_array_stream_1 = require("split-array-stream");
const stream_1 = require("stream");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamEvents = require('stream-events');
// Import the clients for each version supported by this package.
const gapic = Object.freeze({
    v1: require('./v1'),
});
const entity_1 = require("./entity");
const query_1 = require("./query");
/**
 * A map of read consistency values to proto codes.
 *
 * @type {object}
 * @private
 */
const CONSISTENCY_PROTO_CODE = {
    eventual: 2,
    strong: 1,
};
/**
 * Handle logic for Datastore API operations. Handles request logic for
 * Datastore.
 *
 * Creates requests to the Datastore endpoint. Designed to be inherited by
 * the {@link Datastore} and {@link Transaction} classes.
 *
 * @class
 */
class DatastoreRequest {
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
    static prepareEntityObject_(obj) {
        const entityObject = extend(true, {}, obj);
        // Entity objects are also supported.
        if (obj[entity_1.entity.KEY_SYMBOL]) {
            return {
                key: obj[entity_1.entity.KEY_SYMBOL],
                data: entityObject,
            };
        }
        return entityObject;
    }
    allocateIds(key, options, callback) {
        if (entity_1.entity.isKeyComplete(key)) {
            throw new Error('An incomplete key should be provided.');
        }
        options = typeof options === 'number' ? { allocations: options } : options;
        this.request_({
            client: 'DatastoreClient',
            method: 'allocateIds',
            reqOpts: {
                keys: new Array(options.allocations).fill(entity_1.entity.keyToKeyProto(key)),
            },
            gaxOpts: options.gaxOptions,
        }, (err, resp) => {
            if (err) {
                callback(err, null, resp);
                return;
            }
            const keys = arrify(resp.keys).map(entity_1.entity.keyFromKeyProto);
            callback(null, keys, resp);
        });
    }
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
    createReadStream(keys, options = {}) {
        keys = arrify(keys).map(entity_1.entity.keyToKeyProto);
        if (keys.length === 0) {
            throw new Error('At least one Key object is required.');
        }
        const makeRequest = (keys) => {
            const reqOpts = {
                keys,
            };
            if (options.consistency) {
                const code = CONSISTENCY_PROTO_CODE[options.consistency.toLowerCase()];
                reqOpts.readOptions = {
                    readConsistency: code,
                };
            }
            this.request_({
                client: 'DatastoreClient',
                method: 'lookup',
                reqOpts,
                gaxOpts: options.gaxOptions,
            }, (err, resp) => {
                if (err) {
                    stream.destroy(err);
                    return;
                }
                let entities = [];
                try {
                    entities = entity_1.entity.formatArray(resp.found, options.wrapNumbers);
                }
                catch (err) {
                    stream.destroy(err);
                    return;
                }
                const nextKeys = (resp.deferred || [])
                    .map(entity_1.entity.keyFromKeyProto)
                    .map(entity_1.entity.keyToKeyProto);
                split_array_stream_1.split(entities, stream).then(streamEnded => {
                    if (streamEnded) {
                        return;
                    }
                    if (nextKeys.length > 0) {
                        makeRequest(nextKeys);
                        return;
                    }
                    stream.push(null);
                });
            });
        };
        const stream = streamEvents(new stream_1.Transform({ objectMode: true }));
        stream.once('reading', () => {
            makeRequest(keys);
        });
        return stream;
    }
    delete(keys, gaxOptionsOrCallback, cb) {
        const gaxOptions = typeof gaxOptionsOrCallback === 'object' ? gaxOptionsOrCallback : {};
        const callback = typeof gaxOptionsOrCallback === 'function' ? gaxOptionsOrCallback : cb;
        const reqOpts = {
            mutations: arrify(keys).map(key => {
                return {
                    delete: entity_1.entity.keyToKeyProto(key),
                };
            }),
        };
        if (this.id) {
            this.requests_.push(reqOpts);
            return;
        }
        this.request_({
            client: 'DatastoreClient',
            method: 'commit',
            reqOpts,
            gaxOpts: gaxOptions,
        }, callback);
    }
    get(keys, optionsOrCallback, cb) {
        const options = typeof optionsOrCallback === 'object' && optionsOrCallback
            ? optionsOrCallback
            : {};
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
        this.createReadStream(keys, options)
            .on('error', callback)
            .pipe(concat((results) => {
            const isSingleLookup = !Array.isArray(keys);
            callback(null, isSingleLookup ? results[0] : results);
        }));
    }
    runQuery(query, optionsOrCallback, cb) {
        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
        let info;
        this.runQueryStream(query, options)
            .on('error', callback)
            .on('info', info_ => {
            info = info_;
        })
            .pipe(concat((results) => {
            callback(null, results, info);
        }));
    }
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
    runQueryStream(query, options = {}) {
        query = extend(true, new query_1.Query(), query);
        const makeRequest = (query) => {
            const reqOpts = {};
            try {
                reqOpts.query = entity_1.entity.queryToQueryProto(query);
            }
            catch (e) {
                // using setImmediate here to make sure this doesn't throw a
                // synchronous error
                setImmediate(onResultSet, e);
                return;
            }
            if (options.consistency) {
                const code = CONSISTENCY_PROTO_CODE[options.consistency.toLowerCase()];
                reqOpts.readOptions = {
                    readConsistency: code,
                };
            }
            if (query.namespace) {
                reqOpts.partitionId = {
                    namespaceId: query.namespace,
                };
            }
            this.request_({
                client: 'DatastoreClient',
                method: 'runQuery',
                reqOpts,
                gaxOpts: options.gaxOptions,
            }, onResultSet);
        };
        function onResultSet(err, resp) {
            if (err) {
                stream.destroy(err);
                return;
            }
            const info = {
                moreResults: resp.batch.moreResults,
            };
            if (resp.batch.endCursor) {
                info.endCursor = resp.batch.endCursor.toString('base64');
            }
            let entities = [];
            if (resp.batch.entityResults) {
                try {
                    entities = entity_1.entity.formatArray(resp.batch.entityResults, options.wrapNumbers);
                }
                catch (err) {
                    stream.destroy(err);
                    return;
                }
            }
            // Emit each result right away, then get the rest if necessary.
            split_array_stream_1.split(entities, stream).then(streamEnded => {
                if (streamEnded) {
                    return;
                }
                if (resp.batch.moreResults !== 'NOT_FINISHED') {
                    stream.emit('info', info);
                    stream.push(null);
                    return;
                }
                // The query is "NOT_FINISHED". Get the rest of the results.
                const offset = query.offsetVal === -1 ? 0 : query.offsetVal;
                query.start(info.endCursor).offset(offset - resp.batch.skippedResults);
                const limit = query.limitVal;
                if (limit && limit > -1) {
                    query.limit(limit - resp.batch.entityResults.length);
                }
                makeRequest(query);
            });
        }
        const stream = streamEvents(new stream_1.Transform({ objectMode: true }));
        stream.once('reading', () => {
            makeRequest(query);
        });
        return stream;
    }
    merge(entities, callback) {
        const transaction = this.datastore.transaction();
        transaction.run(async (err) => {
            if (err) {
                try {
                    await transaction.rollback();
                }
                catch (error) {
                    // Provide the error & API response from the failed run to the user.
                    // Even a failed rollback should be transparent.
                    // RE: https://github.com/GoogleCloudPlatform/gcloud-node/pull/1369#discussion_r66833976
                }
                callback(err);
                return;
            }
            try {
                await Promise.all(arrify(entities).map(async (objEntity) => {
                    const obj = DatastoreRequest.prepareEntityObject_(objEntity);
                    const [data] = await transaction.get(obj.key);
                    obj.method = 'upsert';
                    obj.data = Object.assign({}, data, obj.data);
                    transaction.save(obj);
                }));
                const [response] = await transaction.commit();
                callback(null, response);
            }
            catch (err) {
                try {
                    await transaction.rollback();
                }
                catch (error) {
                    // Provide the error & API response from the failed commit to the user.
                    // Even a failed rollback should be transparent.
                    // RE: https://github.com/GoogleCloudPlatform/gcloud-node/pull/1369#discussion_r66833976
                }
                callback(err);
            }
        });
    }
    /**
     * @private
     */
    prepareGaxRequest_(config, callback) {
        const datastore = this.datastore;
        const isTransaction = this.id ? true : false;
        const method = config.method;
        const reqOpts = extend(true, {}, config.reqOpts);
        // Set properties to indicate if we're in a transaction or not.
        if (method === 'commit') {
            if (isTransaction) {
                reqOpts.mode = 'TRANSACTIONAL';
                reqOpts.transaction = this.id;
            }
            else {
                reqOpts.mode = 'NON_TRANSACTIONAL';
            }
        }
        if (method === 'rollback') {
            reqOpts.transaction = this.id;
        }
        if (isTransaction && (method === 'lookup' || method === 'runQuery')) {
            if (reqOpts.readOptions && reqOpts.readOptions.readConsistency) {
                throw new Error('Read consistency cannot be specified in a transaction.');
            }
            reqOpts.readOptions = {
                transaction: this.id,
            };
        }
        datastore.auth.getProjectId((err, projectId) => {
            if (err) {
                callback(err);
                return;
            }
            const clientName = config.client;
            if (!datastore.clients_.has(clientName)) {
                datastore.clients_.set(clientName, new gapic.v1[clientName](datastore.options));
            }
            const gaxClient = datastore.clients_.get(clientName);
            reqOpts.projectId = projectId;
            const gaxOpts = extend(true, {}, config.gaxOpts, {
                headers: {
                    'google-cloud-resource-prefix': `projects/${projectId}`,
                },
            });
            const requestFn = gaxClient[method].bind(gaxClient, reqOpts, gaxOpts);
            callback(null, requestFn);
        });
    }
    request_(config, callback) {
        this.prepareGaxRequest_(config, (err, requestFn) => {
            if (err) {
                callback(err);
                return;
            }
            requestFn(callback);
        });
    }
    /**
     * Make a request as a stream.
     *
     * @param {object} config Configuration object.
     * @param {object} config.gaxOpts GAX options.
     * @param {string} config.client The name of the gax client.
     * @param {string} config.method The gax method to call.
     * @param {object} config.reqOpts Request options.
     */
    requestStream_(config) {
        let gaxStream;
        const stream = streamEvents(new stream_1.PassThrough({ objectMode: true }));
        stream.abort = () => {
            if (gaxStream && gaxStream.cancel) {
                gaxStream.cancel();
            }
        };
        stream.once('reading', () => {
            this.prepareGaxRequest_(config, (err, requestFn) => {
                if (err) {
                    stream.destroy(err);
                    return;
                }
                gaxStream = requestFn();
                gaxStream
                    .on('error', stream.destroy.bind(stream))
                    .on('response', stream.emit.bind(stream, 'response'))
                    .pipe(stream);
            });
        });
        return stream;
    }
}
exports.DatastoreRequest = DatastoreRequest;
/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisify_1.promisifyAll(DatastoreRequest);
//# sourceMappingURL=request.js.map