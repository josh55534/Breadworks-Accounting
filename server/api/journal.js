const express = require("express");
const router = express.Router();
const { ROLE, VERIFY, STATUS } = require("./roles-validator/roles");
const { authUser, authAccountant } = require("./middleware/basicAuth");

const Joi = require('joi')

const admin = require('firebase-admin');
const { validateJournal } = require("./journalValidator/journalValidator");
const db = admin.firestore();

const journalRef = db.collection('journals')

// TODO: CREATE JOURNAL ENTRIES
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

    console.log(x + ": " + totalDebit)
    console.log(x + ": " + totalCredit)
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

// TODO: GET ALL APPROVED JOURNAL ENTRIES

// TODO: GET PENDING JOURNAL ENTRIES

// TODO: GET ONE JOURNAL ENTRY

// TODO: UPDATE JOURNAL ENTRY (APPROVED/REJECTED)

// TODO: GET ACCOUNT LEDGER

module.exports = router;