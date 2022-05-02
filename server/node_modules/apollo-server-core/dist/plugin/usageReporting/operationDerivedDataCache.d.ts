import LRUCache from 'lru-cache';
import type { Logger } from 'apollo-server-types';
import type { ReferencedFieldsByType } from './referencedFields';
export interface OperationDerivedData {
    signature: string;
    referencedFieldsByType: ReferencedFieldsByType;
}
export declare function createOperationDerivedDataCache({ logger, }: {
    logger: Logger;
}): LRUCache<string, OperationDerivedData>;
export declare function operationDerivedDataCacheKey(queryHash: string, operationName: string): string;
//# sourceMappingURL=operationDerivedDataCache.d.ts.map