const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const jwt_decode = require('jwt-decode');
const accountsRef = db.collection('accounts');


//Saves the change under changeType in the event log collection and grabs userId from token header
async function saveEventLog(req, res, accountId, changeType, accountData) {
  const decoded = jwt_decode(req.header("Authorization"));
  const logCountRef = db.collection('event logs').doc('accounts').collection(accountId).doc('logCount');
  const logCountSnapshot = await logCountRef.get();
  let logCount = 1;
  if (logCountSnapshot.exists) {
    logCount = logCountSnapshot.data().count + 1;
  }
  const eventLogRef = db.collection('event logs').doc('accounts').collection(accountId).doc(logCount.toString());

  const eventLogData = {
    accountId: accountId,
    changeType: changeType,
    userId: decoded.user.id,
    active: accountData.active,
    assignedUsers: accountData.assignedUsers,
    balance: accountData.balance,
    category: accountData.category,
    comment: accountData.comment,
    credit: accountData.credit,
    dateTimeAdded: accountData.dateTimeAdded,
    debit: accountData.debit,
    desc: accountData.desc,
    id: accountData.id,
    name: accountData.name,
    normalSide: accountData.normalSide,
    number: accountData.number,
    order: accountData.order,
    statement: accountData.statement,
    subcategory: accountData.subcategory,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await eventLogRef.set(eventLogData);
  await logCountRef.set({ count: logCount });
}


async function saveEventLogCreate(req, res, accountId, accountData) {
  const decoded = jwt_decode(req.header("Authorization"));

  const logCountRef = db.collection('event logs').doc('accounts').collection(accountId).doc('logCount');
  const logCountSnapshot = await logCountRef.get();
  let logCount = 1;
  if (logCountSnapshot.exists) {
    logCount = logCountSnapshot.data().count + 1;
  }

  const eventLogRef = db.collection('event logs').doc('accounts').collection(accountId).doc(logCount.toString());

  const eventLogData = {
    accountId: accountId,
    changeType: 'account created',
    userId: decoded.user.id,
    active: accountData.active,
    assignedUsers: accountData.assignedUsers,
    balance: accountData.balance,
    category: accountData.category,
    comment: accountData.comment,
    credit: accountData.credit,
    dateTimeAdded: accountData.dateTimeAdded,
    debit: accountData.debit,
    desc: accountData.desc,
    id: accountData.id,
    name: accountData.name,
    normalSide: accountData.normalSide,
    number: accountData.number,
    order: accountData.order,
    statement: accountData.statement,
    subcategory: accountData.subcategory,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await eventLogRef.set(eventLogData);
  await logCountRef.set({ count: logCount });
}

async function saveEventLogUpdate(req, res, accountId, oldAccount, newAccount, journalDate) {
  const decoded = jwt_decode(req.header("Authorization"));
  

  const logCountRef = db.collection('event logs').doc('accounts').collection(accountId).doc('logCount');
  const logCountSnapshot = await logCountRef.get();
  let logCount = 1;
  if (logCountSnapshot.exists) {
    logCount = logCountSnapshot.data().count + 1;
  }

  const eventLogRef = db.collection('event logs').doc('accounts').collection(accountId).doc(logCount.toString());

  var dateJournal = (!!journalDate) ? journalDate : "";

  const eventLogData = {
    accountId: accountId,
    changeType: 'account updated',
    userId: decoded.user.id,
    oldAccount: oldAccount,
    newAccount: newAccount,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    journalDate: dateJournal
  };

  await eventLogRef.set(eventLogData);
  await logCountRef.set({ count: logCount });
}

async function saveEventLogCreateJournal(req, entryId) {

  const decoded = jwt_decode(req.header("Authorization"));

    const logCountRef = db.collection('event logs').doc('journals').collection(entryId).doc('logCount');
    const logCountSnapshot = await logCountRef.get();
    let logCount = 1;
    if (logCountSnapshot.exists) {
      logCount = logCountSnapshot.data().count + 1;
    }

    const eventLogRef = db.collection('event logs').doc('journals').collection(entryId).doc(logCount.toString());

    const eventLogData = {
      journalId: entryId,
      changeType: 'journal created',
      userId: decoded.user.id,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await eventLogRef.set(eventLogData);
    await logCountRef.set({ count: logCount });

}


async function saveEventLogJournal(req, res, entryId, changeType) {
  const decoded = jwt_decode(req.header("Authorization"));

  const logCountRef = db.collection('event logs').doc('journals').collection(entryId).doc('logCount');
  const logCountSnapshot = await logCountRef.get();
  let logCount = 1;
  if (logCountSnapshot.exists) {
    logCount = logCountSnapshot.data().count + 1;
  }

  const eventLogRef = db.collection('event logs').doc('journals').collection(entryId).doc(logCount.toString());

  const eventLogData = {
    journalId: entryId,
    changeType: changeType,
    userId: decoded.user.id,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await eventLogRef.set(eventLogData);
  await logCountRef.set({ count: logCount });
}


module.exports = { saveEventLog, saveEventLogCreate, saveEventLogUpdate, saveEventLogCreateJournal, saveEventLogJournal };
