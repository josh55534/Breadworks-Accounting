const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const { authUser, authRole } = require("./middleware/basicAuth");
const { ROLE } = require("./roles-validator/roles");
const db = admin.firestore();

const accountLog = db.collection("event logs").doc("accounts");

const DAY_OFFSET = 86400000;

router.get('/trialBalance/:date', authUser, authRole(ROLE.MANAGER), async (req, res) => {
  const docDate = Date.parse(req.params.date) + 86400000;
  const test = accountLog.collection("1-001").doc("1");

  const collectionList = [];
  await accountLog.listCollections()
    .then(collections => {
      for (let collection of collections) {
        collectionList.push(collection.id);
      }
    })

  const accountsData = [];

  var totalBalance = {
    name: "Total",
    debit: 0,
    credit: 0
  };

  for (let id of collectionList) {
    const collectionRef = accountLog.collection(id);
    const logCount = (await collectionRef.doc("logCount").get()).data().count;

    var isDate = false;

    var accountData = {
      id: id,
      name: "",
      debit: 0,
      credit: 0
    }

    for (var x = 1; x <= logCount; x++) {
      const event = (await collectionRef.doc("" + x).get()).data();
      const date = (!!event.journalDate) ? Date.parse(event.journalDate) : (event.timestamp._seconds * 1000);
      if (date < docDate) {
        if (event.changeType === "accountCreated" || event.changeType === "activate") {
          accountData.name = event.name;
          accountData.credit = event.credit;
          accountData.debit = event.debit;
          isDate = true;
        }
        else if (event.changeType === "account updated") {
          accountData.name = event.newAccount.name;
          accountData.credit = event.newAccount.credit;
          accountData.debit = event.newAccount.debit;
          isDate = true;
        }
        else if (event.changeType === "deactivate") {
          isDate = false;
        }
      }
    }

    if (isDate) {
      accountsData.push(accountData)
      totalBalance.credit += accountData.credit;
      totalBalance.debit += accountData.debit;
    };
  }

  accountsData.push(totalBalance);

  res.json(accountsData);
})

router.get('/balanceSheet/:date', authUser, authRole(ROLE.MANAGER), async (req, res) => {
  const docDate = Date.parse(req.params.date) + 86400000;

  const collectionList = [];
  await accountLog.listCollections()
    .then(collections => {
      for (let collection of collections) {
        collectionList.push(collection.id);
      }
    })

  const accountsData = [];

  const assetAccounts = [];
  const equityAccounts = [];
  const liabilityAccounts = [];

  var totalAssets = {
    name: "Total Assets",
    balance: 0,
  };
  var totalEquity = {
    name: "Total Equity",
    balance: 0,
  };
  var totalLiability = {
    name: "Total Liabilities",
    balance: 0,
  };
  var totalEL = {
    name: "Total Liabilities + Equity",
    balance: 0,
  }
  for (let id of collectionList) {
    const collectionRef = accountLog.collection(id);
    const logCount = (await collectionRef.doc("logCount").get()).data().count;

    var isDate = false;

    var accountData = {
      id: id,
      name: "",
      category: "",
      balance: 0,
    }

    for (var x = 1; x <= logCount; x++) {
      const event = (await collectionRef.doc("" + x).get()).data();
      const date = (!!event.journalDate) ? Date.parse(event.journalDate) : (event.timestamp._seconds * 1000);

      if (date < docDate) {
        if (event.changeType === "accountCreated" || event.changeType === "activate") {
          accountData.name = id + " " + event.name;
          accountData.balance = event.balance;
          accountData.category = event.category;
          isDate = true;
        }
        else if (event.changeType === "account updated") {
          accountData.name = event.newAccount.name;
          accountData.balance = event.newAccount.balance;
          accountData.category = event.newAccount.category;
          isDate = true;
        }
        else if (event.changeType === "deactivate") {
          isDate = false;
        }
      }
    }

    if (isDate) {
      if (accountData.category == "assets") {
        assetAccounts.push(accountData)
        totalAssets.balance += accountData.balance;
      }
      else if (accountData.category == "equity") {
        equityAccounts.push(accountData)
        totalEquity.balance += accountData.balance;
        totalEL.balance += accountData.balance;
      }
      else if (accountData.category == "liabilities") {
        liabilityAccounts.push(accountData)
        totalLiability.balance += accountData.balance;
        totalEL.balance += accountData.balance;
      }
    };
  }

  assetAccounts.push(totalAssets);
  liabilityAccounts.push(totalLiability);
  equityAccounts.push(totalEquity);

  accountsData.push(assetAccounts);
  accountsData.push(liabilityAccounts);
  accountsData.push(equityAccounts);
  accountsData.push(totalEL)

  res.json(accountsData);
})


module.exports = router;