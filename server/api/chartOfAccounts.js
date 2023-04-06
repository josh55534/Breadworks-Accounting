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
  const accountsDb = await accountsRef.orderBy("id", "asc").get();
  const accounts = accountsDb.docs.map((doc) => {
    const { id, name, desc, category, statement, active } = doc.data();
    return { id, name, desc, category, statement, active };
  });

  res.json(accounts);
})

// GET ACCOUNT INFO
router.get("/account/:account", authUser, async (req, res) => {
  const accountId = req.params.account;

  if (accountId.empty) {
    return res.status(400).json({ errors: "Account not found" });
  }

  let accountData = await accountsRef.doc(accountId).get().then(accountDb => accountDb.data());

  res.json(accountData);
})

// ACTIVATE ACCOUNT
router.put('/activate/:account', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const accountId = req.params.account;

  let fetchId = await accountsRef.where("id", "==", accountId).get();

  if (fetchId.empty) {
    return res.status(400).json({ errors: "Account not found" });
  }

  await accountsRef.doc(accountId).update({
    active: true
  })

  res.send(`Account ${accountId} is now activated`)
})

// DEACTIVATE ACCOUNT
router.put('/deactivate/:account', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const accountId = req.params.account;
  let fetchId = await accountsRef.where("id", "==", accountId).get();

  let accountDb = await accountsRef.doc(acocuntId).get();
  if (accountDb.empty) {
    res.status(404).json({ errors: "Account not found" })
  }

  let accountData = await accountsRef.doc(accountId).get().then(accountDb => accountDb.data());

  if (accountData.balance != 0) {
    return res.status(400).json({ errors: "Account has a nonzero balance" })
  }

  await accountsRef.doc(accountId).update({
    active: false
  })

  res.send(`Account ${accountId} is now deactivated`)
})

// UPDATE ACCOUNT (REQUIRES ADMIN)
router.put('/update/:account', authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const accountId = req.params.account;

  let fetchId = await accountsRef.where("id", "==", accountId).get();

  if (fetchId.empty) {
    return res.status(400).json({ errors: "Account not found" });
  }

  const { error, value } = validateAccount(req.body);

  if (error) {
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.status(400).json({ errors: errorFull });
  }
  let accountData = await accountsRef.doc(accountId).get().then(accountDb => accountDb.data());


  const updateAccount = {
    number: req.body.number || accountData.number,
    order: req.body.order || accountData.order,
    name: req.body.name || accountData.name,
    desc: req.body.desc || accountData.desc,
    normalSide: req.body.normalSide || accountData.normalSide,
    category: req.body.category || accountData.category,
    subcategory: req.body.subcategory || accountData.subcategory,
    balance: req.body.balance || accountData.balance,
    credit: req.body.credit || accountData.credit,
    debit: req.body.debit || accountData.debit,
    assignedUsers: req.body.assignedUsers || accountData.assignedUsers,
    comment: req.body.comment || accountData.comment,
    statement: req.body.statement || accountData.statement
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
  var {
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

  const id = number + "-" + order;
  let account = await accountsRef.where("name", "==", name).get(); //Check if account name is in database already

  if (!account.empty)
    return res
      .status(400)
      .json({ errors: "This account name has already been used." });

  account = await accountsRef.where("id", "==", id).get(); //Check if account number is in database already

  if (!account.empty)
    return res
      .status(400)
      .json({ errors: "This account number has already been used." });

  const dateCreated = new Date();
  const date = dateCreated.getMonth() + "/" + dateCreated.getDate() + "/" + dateCreated.getFullYear();
  const timestamp = dateCreated.getUTCHours() + ":" + dateCreated.getUTCMinutes();
  const time = date + " : " + timestamp;
  balance = parseFloat(balance);
  credit = parseFloat(credit);
  debit = parseFloat(debit);

  await accountsRef.doc(id).set({
    id: id,
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
    dateTimeAdded: time,
    active: true
  });
  res.send('Successfully added account');
})

module.exports = router;