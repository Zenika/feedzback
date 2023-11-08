/** @module getFeedbacks */
import admin from 'firebase-admin';
import datastore from '../../index.js';

/**
 * get recieved feedbacks for a specified user
 *  the feedbacks will be return according to the email user passed as argument
 * @param {String} email
 * @param {String} token
 * @return {Array} feedbacks or an error in failed case
 */
export const getReceivedFeedbacks = async (email, token) => {
  try {
    await admin.auth().verifyIdToken(token).catch(() => {
      throw new Error('vous n\'etes pas authorisé');
    });

    /**
     * feedback is the name of the table in datastore
     * as you see we filter feedbacks by receverEmail
     * @type {Query}
     */
    const query = datastore.createQuery('feedzback').filter('receverEmail', '=', email);
    const [entities] = await datastore.runQuery(query);
    const res = combineEntityAndKey(entities);
    return res;
  } catch (err) {
    return err;
  }
};

/**
 * get sent feedbacks for a specific user
 * the feedbacks will be return according to the email user passed as argument
 * @param {String} email
 * @param {String} token
 * @return {Array} feedbacks or error in failed case
 */
export const getSentFeedbacks = async (email, token) => {
  try {
    await admin.auth().verifyIdToken(token).catch(() => {
      throw new Error('vous n\'etes pas authorisé');
    });

    /**
     * feedback is the name of the table in datastore
     * as you see we filter feedbacks by senderEmail
     * @type {Query}
     */
    const query = datastore.createQuery('feedzback').filter('senderEmail', '=', email);
    const [entities] = await datastore.runQuery(query);
    const res = combineEntityAndKey(entities);
    return res;
  } catch (err) {
    return err;
  }
};

/**
 * get a specific feedback (sent or received) by Id
 * @param {String} id
 * @param {String} token
 * @return {Object} feedbacks or error in failed case
 */
export const getFeedbackById = async (id, token) => {
  try {
    await admin.auth().verifyIdToken(token).catch(() => {
      throw new Error('vous n\'etes pas authorisé');
    });

    /**
     * feedback is the name of the table in datastore
     * as you see we filter feedbacks by key which is the id of each row in the table
     * @type {Query}
     */
    const key = datastore.key(['feedzback', parseInt(id, 10)]);
    const query = datastore.createQuery('feedzback').filter('__key__', '=', key);
    const [[entity]] = await datastore.runQuery(query);
    return entity;
  } catch (err) {
    return err;
  }
};

/**
 * Assign each entity to datastore key
 * @param {Object} entities
 * @return {Array}
 */
export const combineEntityAndKey = (entities) => {
  const list = [];
  for (let i=0; i<entities.length; i++) {
    const res = Object.assign(entities[i], entities[i][datastore.KEY]);
    list.push(res);
  }
  return list;
};
