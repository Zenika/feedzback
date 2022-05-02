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
exports.Query = void 0;
const arrify = require("arrify");
/**
 * Build a Query object.
 *
 * **Queries are built with {module:datastore#createQuery} and
 * {@link Transaction#createQuery}.**
 *
 * @see {@link http://goo.gl/Cag0r6| Datastore Queries}
 *
 * @class
 * @param {Datastore|Transaction} scope The parent scope the query was created
 *     from.
 * @param {string} [namespace] Namespace to query entities from.
 * @param {string[]} kinds Kind to query.
 *
 * @example
 * ```
 * const {Datastore} = require('@google-cloud/datastore');
 * const datastore = new Datastore();
 * const query = datastore.createQuery('AnimalNamespace', 'Lion');
 * ```
 */
class Query {
    constructor(scope, namespaceOrKinds, kinds) {
        let namespace = namespaceOrKinds;
        if (!kinds) {
            kinds = namespaceOrKinds;
            namespace = null;
        }
        /**
         * @name Query#scope
         * @type {Datastore|Transaction}
         */
        this.scope = scope;
        /**
         * @name Query#namespace
         * @type {?string}
         */
        this.namespace = namespace || null;
        /**
         * @name Query#kinds
         * @type {string}
         */
        this.kinds = kinds;
        /**
         * @name Query#filters
         * @type {array}
         */
        this.filters = [];
        /**
         * @name Query#orders
         * @type {array}
         */
        this.orders = [];
        /**
         * @name Query#groupByVal
         * @type {array}
         */
        this.groupByVal = [];
        /**
         * @name Query#selectVal
         * @type {array}
         */
        this.selectVal = [];
        // pagination
        /**
         * @name Query#startVal
         * @type {?number}
         */
        this.startVal = null;
        /**
         * @name Query#endVal
         * @type {?number}
         */
        this.endVal = null;
        /**
         * @name Query#limitVal
         * @type {number}
         */
        this.limitVal = -1;
        /**
         * @name Query#offsetVal
         * @type {number}
         */
        this.offsetVal = -1;
    }
    filter(property, operatorOrValue, value) {
        let operator = operatorOrValue;
        if (arguments.length === 2) {
            value = operatorOrValue;
            operator = '=';
        }
        this.filters.push({
            name: property.trim(),
            op: operator.trim(),
            val: value,
        });
        return this;
    }
    /**
     * Filter a query by ancestors.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/queries#datastore-ancestor-query-nodejs| Datastore Ancestor Filters}
     *
     * @param {Key} key Key object to filter by.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const query = datastore.createQuery('MyKind');
     * const ancestoryQuery = query.hasAncestor(datastore.key(['Parent', 123]));
     * ```
     */
    hasAncestor(key) {
        this.filters.push({ name: '__key__', op: 'HAS_ANCESTOR', val: key });
        return this;
    }
    /**
     * Sort the results by a property name in ascending or descending order. By
     * default, an ascending sort order will be used.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/queries#datastore-ascending-sort-nodejs| Datastore Sort Orders}
     *
     * @param {string} property The property to order by.
     * @param {object} [options] Options object.
     * @param {boolean} [options.descending=false] Sort the results by a property
     *     name in descending order.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     *
     * // Sort by size ascendingly.
     * const companiesAscending = companyQuery.order('size');
     *
     * // Sort by size descendingly.
     * const companiesDescending = companyQuery.order('size', {
     *   descending: true
     * });
     * ```
     */
    order(property, options) {
        const sign = options && options.descending ? '-' : '+';
        this.orders.push({ name: property, sign });
        return this;
    }
    /**
     * Group query results by a list of properties.
     *
     * @param {array} properties Properties to group by.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     * const groupedQuery = companyQuery.groupBy(['name', 'size']);
     * ```
     */
    groupBy(fieldNames) {
        this.groupByVal = arrify(fieldNames);
        return this;
    }
    /**
     * Retrieve only select properties from the matched entities.
     *
     * Queries that select a subset of properties are called Projection Queries.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/projectionqueries| Projection Queries}
     *
     * @param {string|string[]} fieldNames Properties to return from the matched
     *     entities.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     *
     * // Only retrieve the name property.
     * const selectQuery = companyQuery.select('name');
     *
     * // Only retrieve the name and size properties.
     * const selectQuery = companyQuery.select(['name', 'size']);
     * ```
     */
    select(fieldNames) {
        this.selectVal = arrify(fieldNames);
        return this;
    }
    /**
     * Set a starting cursor to a query.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets| Query Cursors}
     *
     * @param {string} cursorToken The starting cursor token.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     *
     * const cursorToken = 'X';
     *
     * // Retrieve results starting from cursorToken.
     * const startQuery = companyQuery.start(cursorToken);
     * ```
     */
    start(start) {
        this.startVal = start;
        return this;
    }
    /**
     * Set an ending cursor to a query.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/queries#Datastore_Query_cursors| Query Cursors}
     *
     * @param {string} cursorToken The ending cursor token.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     *
     * const cursorToken = 'X';
     *
     * // Retrieve results limited to the extent of cursorToken.
     * const endQuery = companyQuery.end(cursorToken);
     * ```
     */
    end(end) {
        this.endVal = end;
        return this;
    }
    /**
     * Set a limit on a query.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/queries#datastore-limit-nodejs| Query Limits}
     *
     * @param {number} n The number of results to limit the query to.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     *
     * // Limit the results to 10 entities.
     * const limitQuery = companyQuery.limit(10);
     * ```
     */
    limit(n) {
        this.limitVal = n;
        return this;
    }
    /**
     * Set an offset on a query.
     *
     * @see {@link https://cloud.google.com/datastore/docs/concepts/queries#datastore-limit-nodejs| Query Offsets}
     *
     * @param {number} n The offset to start from after the start cursor.
     * @returns {Query}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const companyQuery = datastore.createQuery('Company');
     *
     * // Start from the 101st result.
     * const offsetQuery = companyQuery.offset(100);
     * ```
     */
    offset(n) {
        this.offsetVal = n;
        return this;
    }
    run(optionsOrCallback, cb) {
        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
        const runQuery = this.scope.runQuery.bind(this.scope);
        return runQuery(this, options, callback);
    }
    /**
     * Run the query as a readable object stream.
     *
     * @method Query#runStream
     * @param {object} [options] Optional configuration. See
     *     {@link Query#run} for a complete list of options.
     * @returns {stream}
     *
     * @example
     * ```
     * const {Datastore} = require('@google-cloud/datastore');
     * const datastore = new Datastore();
     * const query = datastore.createQuery('Company');
     *
     * query.runStream()
     *   .on('error', console.error)
     *   .on('data', function (entity) {
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
     * query.runStream()
     *   .on('data', function (entity) {
     *     this.end();
     *   });
     * ```
     */
    runStream(options) {
        return this.scope.runQueryStream(this, options);
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map