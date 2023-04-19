const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const { authUser, authRole } = require("./middleware/basicAuth");
const { ROLE } = require("./roles-validator/roles");
const db = admin.firestore();

const accountLog = db.collection("event logs").doc("accounts");

router.get('/trialBalance/:date', authUser, authRole(ROLE.MANAGER), async (req, res) => {
  const docDate = Date.parse(req.params.date);
  const test = accountLog.collection("1-001").doc("1");
  const date = await test.get();

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
      const event = (await collectionRef.doc(""+x).get()).data();
      if((event.timestamp._seconds*1000) <= docDate) {
        if(event.changeType === "accountCreated" || event.changeType === "activate") {
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

    if(isDate){ 
      accountsData.push(accountData)
      totalBalance.credit += accountData.credit;
      totalBalance.debit += accountData.debit;
    };
  }

  accountsData.push(totalBalance);

  console.log(accountsData);
  res.json(accountsData);
})

module.exports = router;