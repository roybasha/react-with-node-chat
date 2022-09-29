
const db = require('./config').firestore();
const { Timestamp } = require('firebase-admin').firestore;
const { logger } = require('../utils');

const setMessage = (room, message) => {
  db.collection(room).add(message);
};

const getMessages = async (room) => {
  const snapshot = await db.collection(room).get();
  const docs = snapshot.docs.map(doc => doc.data());
  try {
    return docs.map(doc => ({ ...doc, timestamp: new Timestamp(doc.timestamp.seconds, doc.timestamp.nanoseconds).toDate() }));
  } catch (e) {
    logger(e);
    return [];
  }
};

module.exports = {
  setMessage,
  getMessages
};
