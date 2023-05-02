const fs = require('fs');

const { v4: uuidv4 } = require('uuid')

const express = require("express");
const router = express.Router();

const { ROLE, VERIFY, STATUS } = require("./roles-validator/roles");
const { validateJournal } = require("./journalValidator/journalValidator");
const { authUser, authAccountant, authRole } = require("./middleware/basicAuth");

const Joi = require('joi')

const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage')
const journalDocPath = "fir-demo-94d61.appspot.com/journalDocuments"
const eventLog = require('./eventLog');
const jwt_decode = require('jwt-decode');

const db = admin.firestore();

const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads/')
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname)
  }
})
let upload = multer({ storage: storage });

const journalRef = db.collection('journals');
const accountsRef = db.collection('accounts');
const documentBucket = getStorage().bucket();

// CREATE JOURNAL ENTRIES

router.post('/new-entry', upload.single('file'), authUser, authAccountant(ROLE.MANAGER, ROLE.BASIC), async (req, res) => {

  var {
    transactions,
    desc,
    date,
    userName
  } = req.body;

  for (let x in transactions) {
    transactions[x] = JSON.parse(transactions[x])
  }

  const { error, value } = validateJournal(req.body);

  if (error) {
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].context.label);
    }
    return res.status(400).json({ errors: errorFull });
  }

  var totalCredit = 0;
  var totalDebit = 0;

  for (x in transactions) {
    transactions[x].creditAmount = parseFloat(transactions[x].creditAmount)
    transactions[x].debitAmount = parseFloat(transactions[x].debitAmount)

    totalCredit += transactions[x].creditAmount;
    totalDebit += transactions[x].debitAmount;
  }

  if (totalCredit !== totalDebit) {
    return res.status(400).json({ errors: "Credit must equal debit" })
  }
  if (transactions.length < 2) {
    return res.status(400).json({ errors: "Must have at least 2 accounts"})
  }

  const counter = await journalRef.count().get();
  const journalID = (counter.data().count + 1);


  try {
    await journalRef.doc("" + journalID).set({
      id: journalID,
      transactions,
      desc,
      date,
      userName,
      status: "pending"
    })
      .then(async (res) => {
        const files = fs.readdirSync('uploads/')
        if (files.length !== 0) {
          await documentBucket.upload(`uploads/${files[0]}`, {
            destination: `journalDocuments/${journalID}/${files[0]}`, public: true, metadata: {
              metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
              }
            }
          })
          fs.unlink(`uploads/${files[0]}`, (err) => {
            console.log(err)
          });
        }
      });
    await eventLog.saveEventLogCreateJournal(req, journalID.toString());
    res.json('Successfully added journal');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }

})


// GET ALL JOURNAL ENTRIES
router.get("/entries/", authUser, async (req, res) => {
  const journalDb = await journalRef.orderBy("id", "desc").get();
  const journals = journalDb.docs.map((doc) => {
    const { id, date, transactions, desc, status } = doc.data();
    return { id, date, transactions, desc, status }
  });

  res.json(journals);
})

// GET PENDING JOURNAL ENTRIES
router.get('/entries/pending', authUser, async (req, res) => {
  const journalDb = await journalRef.where("status", "==", "pending").orderBy("id", "desc").get();

  const entry = journalDb.docs.map((doc) => {
    const { id, desc, date, userName, status } = doc.data();
    return { id, desc, date, userName, status }
  })

  res.json(entry);
})

// GET ONE JOURNAL ENTRY
router.get('/entry/:entryID', authUser, async (req, res) => {
  const entryID = req.params.entryID;

  const fetchID = await journalRef.doc(entryID).get();

  if (fetchID.empty) {
    return res.status(400).json({ errors: "Journal not found" });
  }

  const entry = fetchID.data();
  res.json(entry);
})

// UPDATE JOURNAL ENTRY (APPROVED)
router.put('/entry/approve/:entryID', authUser, authRole(ROLE.MANAGER), async (req, res) => {
  const entryID = req.params.entryID;

  const entryRef = journalRef.doc(entryID);

  const fetchID = await entryRef.get();
  if (fetchID.empty) {
    return res.status(400).json({ errors: "Journal not found" });
  }

  var entry = fetchID.data();
  var transactions = entry.transactions;

  if (entry.status !== "pending") {
    return res.status(400).json({ errors: "Journal not pending" });
  }

  const batch = db.batch();
  var accountDb;
  var accountData;
  var accountRef;

  for (var x = 0; x < transactions.length; x++) {
    try {
      accountRef = accountsRef.doc(transactions[x].accountID);
      accountDb = await accountRef.get();
      accountData = accountDb.data();
      var newBalance = accountData.balance

      transactions[x].creditAfter = accountData.credit + transactions[x].creditAmount;
      transactions[x].debitAfter = accountData.debit + transactions[x].debitAmount;

      if (accountData.normalSide === "L" || accountData.normalSide === "l") {
        newBalance += transactions[x].debitAmount;
        newBalance -= transactions[x].creditAmount;
      }
      else if (accountData.normalSide === "R" || accountData.normalSide === "r") {
        newBalance += transactions[x].creditAmount;
        newBalance -= transactions[x].debitAmount;
      }
      const updateAccount = {
        name: accountData.name,
        desc: accountData.desc,
        normalSide: accountData.normalSide,
        category: accountData.category,
        subcategory: accountData.subcategory,
        balance: accountData.balance,
        credit: accountData.credit,
        debit: accountData.debit,
        assignedUsers: accountData.assignedUsers,
        comment: accountData.comment,
        statement: accountData.statement
      };

      const newAccount = {
        name: accountData.name,
        desc: accountData.desc,
        normalSide: accountData.normalSide,
        category: accountData.category,
        subcategory: accountData.subcategory,
        balance: newBalance,
        credit: transactions[x].creditAfter,
        debit: transactions[x].debitAfter,
        assignedUsers: accountData.assignedUsers,
        comment: accountData.comment,
        statement: accountData.statement
      };

      batch.update(accountRef, newAccount);
      await eventLog.saveEventLogUpdate(req, res, transactions[x].accountID, updateAccount, newAccount, entry.date);

    }
    catch (e) {
      console.log("error happened here")
    }
  }

  entry.status = "approved"
  eventLog.saveEventLogJournal(req, res, entryID, 'approved');
  batch.update(entryRef, entry);

  batch.commit().then(() => {
    res.send("Updated successfully");
  });
})

// UPDATE JOURNAL ENTRY (REJECTED)
router.put('/entry/reject/:entryID', authUser, authRole(ROLE.MANAGER), async (req, res) => {
  const entryID = req.params.entryID;

  const entryRef = journalRef.doc(entryID);

  fetchID = await entryRef.get()

  if (fetchID.empty) {
    return res.status(400).json({ errors: "Journal not found" });
  }

  var entry = fetchID.data();
  entry.status = "rejected";

  await entryRef.set(entry);
  eventLog.saveEventLogJournal(req, res, entryID, 'rejected');
  res.send("Updated succesfully")
})

// GET ACCOUNT LEDGER
router.get('/accountLedger/:accountID', authUser, async (req, res) => {
  const accountID = req.params.accountID;

  const accountRef = accountsRef.doc(accountID);
  fetchID = await accountRef.get();

  if (fetchID.empty) {
    return res.status(400).json({ errors: "Account not found" })
  }

  const accountData = fetchID.data();
  const accountName = accountData.name;
  const accountBalance = accountData.balance;

  const counter = await journalRef.count().get();
  const numAccounts = counter.data().count;

  var journalData = [];
  var journalEntry;
  var transactionList;
  var data = {
    date: "",
    desc: "",
    id: "",
    debit: 0.0,
    credit: 0.0,
    totalCredit: 0.0,
    totalDebit: 0.0
  }

  for (var x = numAccounts; x > 0; x--) {
    journalEntry = (await journalRef.doc("" + x).get()).data();

    if (journalEntry.status === "approved") {
      transactionList = journalEntry.transactions
      for (y in transactionList) {

        if (transactionList[y].accountID == accountID) {
          data.date = journalEntry.date;
          data.desc = journalEntry.desc;
          data.id = journalEntry.id;
          data.debit = transactionList[y].debitAmount;
          data.credit = transactionList[y].creditAmount;
          data.totalCredit = transactionList[y].creditAfter;
          data.totalDebit = transactionList[y].debitAfter;

          journalData.push({ ...data });
        }
      }
    }
  }

  const package = {
    accountName: accountName,
    accountBalance: accountBalance,
    journalData: journalData
  }

  res.send(package);


})

module.exports = router;