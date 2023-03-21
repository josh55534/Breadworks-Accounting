const express = require('express');
const router = express.Router();

const { ROLE, VERIFY, STATUS } = require("./roles-validator/roles");

const { authUser, authRole } = require("./middleware/basicAuth");

const Joi = require('joi')

const admin = require('firebase-admin');
const { validateAccount } = require('./accountValidator/accountValidator');
const db = admin.firestore();

const accountsRef = db.collection('accounts');

// GET CHART OF ACCOUNTS
router.get("/", authUser, async (req, res) => {
  const accountsDb = await accountsRef.get();
  const accounts = accountsDb.docs.map((doc) => {
    const { name, desc, category, statement, active } = doc.data();
    const id = doc.id
    return { id, name, desc, category, statement, active };
  });

  res.json(accounts);
})

// GET ACCOUNT INFO
router.get("/account/:account", authUser, async (req, res) => {
  const accountId = req.params.account;

  let accountDb = await accountsRef.doc(accountId).get();
  if (accountDb.empty) {
    res.status(404).json({ errors: "Account not found" })
  }

  let accountData = await accountDb.data();

  res.json(accountData);
})

// ACTIVATE ACCOUNT
router.put('/activate/:account', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const accountId = req.params.account;

  let accountDb = await accountsRef.doc(acocuntId).get();
  if (accountDb.empty) {
    res.status(404).json({ errors: "Account not found" })
  }

  await accountsRef.doc(accountId).update({
    active: true
  })

  res.send(`Account ${acocuntId} is now activated`)
})

// DEACTIVATE ACCOUNT
router.put('/activate/:account', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const accountId = req.params.account;

  let accountDb = await accountsRef.doc(acocuntId).get();
  if (accountDb.empty) {
    res.status(404).json({ errors: "Account not found" })
  }

  let accountData = await accountDb.data();

  if (accountData.balance != 0) {
    res.status(400).json({ errors: "Account has a nonzero balance" })
  }

  await accountsRef.doc(accountId).update({
    active: false
  })

  res.send(`Account ${acocuntId} is now deactivated`)
})

// UPDATE ACCOUNT (REQUIRES ADMIN)
router.put('update/:account', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const accountId = req.params.account;

  let accountDb = await accountsRef.doc(accountId).get()
  if (accountDb.empty) {
    res.status(404).json({ errors: "Account not found" });
  }

  const { error, value } = validateAccount(req.body);

  if (error) {
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.status(400).json({ errors: errorFull });
  }

  let accountData = await accountDb.data();

  const updateAccount = {
    number: req.body.number || accountData.number,
    order: req.body.number || accountData.number,
    name: req.body.number || accountData.number,
    desc: req.body.number || accountData.number,
    normalSide: req.body.number || accountData.number,
    category: req.body.number || accountData.number,
    subcategory: req.body.number || accountData.number,
    balance: req.body.number || accountData.number,
    credit: req.body.number || accountData.number,
    debit: req.body.number || accountData.number,
    assignedUsers: req.body.number || accountData.number,
    comment: req.body.number || accountData.number,
    statement: req.body.number || accountData.number
  };

  const id = number + "" + order;

  if (id != accountId) {
    let accountSnap = await accountsRef.doc(id).get();
    if (!accountSnap.empty) {
      return res
        .status(400)
        .json({ errors: "This account already exists" });
    }

    accountSnap = await accountsRef.where("name", "==", name).get();
    if (!accountSnap.empty) {
      return res
        .status(400)
        .json({ errors: "This account already exists" });
    }

    const newAccount = accountDb.doc(id).set(updateAccount);
    const oldAccount = accountDb.doc(accountId);

    const batch = db.batch();
    batch.set(newAccount);
    batch.delete(oldAccount);
    batch.commit();
  }
  else await accountsRef.doc(accountId).update(updateAccount);
})

// CREATE ACCOUNT (REQUIRES ADMIN)
router.post('/createAccount', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const {
    number,
    order,
    name,
    desc,
    normalSide,
    category,
    subcategory,
    balance,
    credit,
    debit,
    assignedUsers,
    comment,
    statement
  } = req.body;

  const { error, value } = validateAccount(req.body);

  if (error) {
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.status(400).json({ errors: errorFull });
  }

  const id = number + "" + order;
  let accountSnap = await accountsRef.doc(id).get();
  if (!accountSnap.empty) {
    return res
      .status(400)
      .json({ errors: "This account already exists" });
  }

  accountSnap = await accountsRef.where("name", "==", name).get();
  if (!accountSnap.empty) {
    return res
      .status(400)
      .json({ errors: "This account already exists" });
  }

  const dateCreated = new Date();
  const date = dateCreated.getMonth() + "/" + dateCreated.getDate() + "/" + dateCreated.getFullYear();
  const timestamp = dateCreated.getUTCHours() + ":" + dateCreated.getUTCMinutes();
  const time = date + " : " + timestamp;

  await accountsRef.doc(id).set({
    number,
    order,
    name,
    desc,
    normalSide,
    category,
    subcategory,
    balance,
    credit,
    debit,
    assignedUsers,
    comment,
    statement,
    active: true
  });
  res.send('Successfully added account');
});

module.exports = router;