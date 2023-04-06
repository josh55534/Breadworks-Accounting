const express = require("express");
const router = express.Router();
const { ROLE, VERIFY, STATUS } = require("./roles-validator/roles");
const { authUser, authAccountant } = require("./middleware/basicAuth");

const Joi = require('joi')

const admin = require('firebase-admin');
const { validateJournal } = require("./journalValidator/journalValidator");
const db = admin.firestore();

const journalRef = db.collection('journals')

// CREATE JOURNAL ENTRIES
router.post('/new-entry', authUser, authAccountant(ROLE.MANAGER, ROLE.BASIC), async (req, res) => {
  const {
    transactions,
    desc,
    date,
    userName,
  } = req.body;

  const { error, value } = validateJournal(req.body);

  if (error) {
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.status(400).json({ errors: errorFull });
  }

  var totalCredit = 0;
  var totalDebit = 0;

  for(x in transactions) {
    transactions[x].creditAmount = parseFloat(transactions[x].creditAmount)
    transactions[x].debitAmount = parseFloat(transactions[x].debitAmount)

    totalCredit += transactions[x].creditAmount;
    totalDebit += transactions[x].debitAmount;
  }

  console.log(totalCredit);
  console.log(totalDebit)

  if(totalCredit !== totalDebit) {
    return res.status(400).json({ errors: "Credit must equal debit" })
  }

  const snapshot = await journalRef.count().get();
  const journalID = "" + (snapshot.data().count + 1);

  await journalRef.doc(journalID).set({
    id: journalID,
    transactions,
    desc,
    date,
    userName,
    status: "pending"
  });

  res.send('Successfully added journal')
})

// GET ALL JOURNAL ENTRIES
router.get("/entries/", authUser, async(req, res) => {
  const journalDb = await journalRef.orderBy("id", "desc").get();
  const journals = journalDb.docs.map((doc) => {
    const { id, date, transactions, desc } = doc.data();
    return { id, date, transactions, desc }
  });

  res.json(journals);
})

// GET PENDING JOURNAL ENTRIES
router.get('/entries/pending', authUser, async(req,res) =>{
  const journalDb = await journalRef.where("status", "==", "pending").orderBy("id","desc").get();

  const entry = journalDb.docs.map((doc) => {
    const { id, desc, date, userName, status } = doc.data();
    return { id, desc, date, userName, status }
  })

  res.json(entry);
})

// GET ONE JOURNAL ENTRY
router.get('/entry/:entryID', authUser, async(req,res) =>{
  const entryID = req.params.entryID;

  const fetchID = await journalRef.doc(entryID).get();

  if(fetchID.empty) {
    return res.status(400).json({ errors: "Account not found" });
  }

  const entry = fetchID.data();
  res.json(entry);
})

// TODO: UPDATE JOURNAL ENTRY (APPROVED/REJECTED)

// TODO: GET ACCOUNT LEDGER

module.exports = router;