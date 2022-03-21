import { CallOptions, ServiceError } from 'google-gax';
import { Datastore } from './';
import { google } from '../protos/protos';
export interface GenericIndexCallback<T> {
    (err?: ServiceError | null, index?: Index | null, apiResponse?: T | null): void;
}
export declare type GetIndexCallback = GenericIndexCallback<IIndex>;
export declare type GetIndexResponse = [Index, IIndex];
export declare type IndexGetMetadataCallback = (err?: ServiceError | null, metadata?: IIndex | null) => void;
export declare type IndexGetMetadataResponse = [IIndex];
export interface GetIndexesOptions {
    filter?: string;
    gaxOptions?: CallOptions;
    pageSize?: number;
    pageToken?: string;
    autoPaginate?: boolean;
}
export declare type GetIndexesResponse = [Index[], GetIndexesOptions, google.datastore.admin.v1.IListIndexesResponse];
export declare type GetIndexesCallback = (err?: ServiceError | null, indexes?: Index[], nextQuery?: GetIndexesOptions, apiResponse?: google.datastore.admin.v1.IListIndexesResponse) => void;
export declare type IIndex = google.datastore.admin.v1.IIndex;
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
export declare class Index {
    datastore: Datastore;
    id: string;
    metadata?: IIndex;
    constructor(datastore: Datastore, id: string);
    /**
     * Get an index if it exists.
     *
     * @param {object} [gaxOptions] Request configuration options, outlined here:
     *     https://googleapis.github.io/gax-nodejs/CallSettings.html.
     * @param {function} callback The callback function.
     * @param {?error} callback.err An error returned while making this request.
     * @param {Index} callback.index The Index instance.
     * @param {object} callback.apiResponse The full API response.
     */
    get(gaxOptions?: CallOptions): Promise<GetIndexResponse>;
    get(callback: GetIndexCallback): void;
    get(gaxOptions: CallOptions, callback: GetIndexCallback): void;
    /**
     * Get the metadata of this index.
     *
     * @param {object} [gaxOptions] Request configuration options, outlined here:
     *     https://googleapis.github.io/gax-nodejs/CallSettings.html.
     * @param {function} callback The callback function.
     * @param {?error} callback.err An error returned while making this request.
     * @param {object} callback.metadata The metadata.
     */
    getMetadata(gaxOptions?: CallOptions): Promise<IndexGetMetadataResponse>;
    getMetadata(callback: IndexGetMetadataCallback): void;
    getMetadata(gaxOptions: CallOptions, callback: IndexGetMetadataCallback): void;
}
