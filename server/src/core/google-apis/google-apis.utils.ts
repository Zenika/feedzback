/**
 * Inside Zenika's organization, the `Schema$User['relations']` Google API field, follows a particular interface.
 *
 * import type { admin_directory_v1 } from '@googleapis/admin';
 *
 *    `admin_directory_v1.Schema$User['relations']`
 * is equal to:
 *    `{ type: 'manager'; value: string }[]`
 */

type ManagerRelation = {
  type: 'manager';
  /**
   * The manager email.
   */
  value: string;
};

const isManagerRelation = (relation: unknown): relation is ManagerRelation =>
  Object.prototype.toString.call(relation) === '[object Object]' && (relation as ManagerRelation).type === 'manager';

export const mapGoogleUserRelationsToZenikaManagerEmail = (relations: unknown) =>
  Array.isArray(relations) ? relations.find(isManagerRelation)?.value : undefined;
