"use strict";
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const promisify_1 = require("@google-cloud/promisify");
/**
 * @class
 * @param {Datastore} datastore The parent instance of this index.
 * @param {string} id The index name or id.
 *
 * @example
 * ```
 * const {Datastore} = require('@google-cloud/datastore');
 * const datastore = new Datastore();
 * const index = datastore.index('my-index');
 * ```
 */
class Index {
    constructor(datastore, id) {
        this.datastore = datastore;
        this.id = id.split('/').pop();
    }
    get(gaxOptionsOrCallback, cb) {
        const gaxOpts = typeof gaxOptionsOrCallback === 'object' ? gaxOptionsOrCallback : {};
        const callback = typeof gaxOptionsOrCallback === 'function' ? gaxOptionsOrCallback : cb;
        this.getMetadata(gaxOpts, (err, metadata) => {
            callback(err, err ? null : this, metadata);
        });
    }
    getMetadata(gaxOptionsOrCallback, cb) {
        const gaxOpts = typeof gaxOptionsOrCallback === 'object' ? gaxOptionsOrCallback : {};
        const callback = typeof gaxOptionsOrCallback === 'function' ? gaxOptionsOrCallback : cb;
        this.datastore.request_({
            client: 'DatastoreAdminClient',
            method: 'getIndex',
            reqOpts: {
                indexId: this.id,
            },
            gaxOpts,
        }, (err, resp) => {
            if (resp) {
                this.metadata = resp;
            }
            callback(err, resp);
        });
    }
}
exports.Index = Index;
/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisify_1.promisifyAll(Index);
//# sourceMappingURL=index-class.js.map