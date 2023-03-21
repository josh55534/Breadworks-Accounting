const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const { ROLE, VERIFY, STATUS } = require("./roles-validator/roles");
const admin = require("firebase-admin");
const db = admin.firestore();
const { authUser, authRole } = require("./middleware/basicAuth");

const accountRef = db.collection("accounts");

router.post("/", authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const {
    accountName,
    accountNumber,
    accountDescription,
    normalSide,
    accountCategory,
    accountSubcategory,
    initialBalance,
    debit,
    credit,
    balance,
    dateTimeAdded,
    userId,
    order,
    statement,
    comment,
  } = req.body;

  async function getMaxIdAndAddOne() {
    const snapshot = await accountRef.orderBy("id", "desc").limit(1).get();
    if (snapshot.empty) {
      return 1;
    } else {
      const data = snapshot.docs[0].data();
      return data.id + 1;
    }
  }

  const newId = await getMaxIdAndAddOne();

  let account = await accountRef.where("accountName", "==", accountName).get(); //Check if account name is in database already

  if (!account.empty)
    return res
      .status(400)
      .json({ errors: "This account name has already been used." });

  account = await accountRef.where("accountNumber", "==", accountNumber).get(); //Check if account number is in database already

  if (!account.empty)
    return res
      .status(400)
      .json({ errors: "This account number has already been used." });

  try {
    await db.collection("accounts").doc(newId.toString()).set({
      id: newId,
      accountName,
      accountNumber,
      accountDescription,
      normalSide,
      accountCategory,
      accountSubcategory,
      initialBalance,
      debit,
      credit,
      balance,
      dateTimeAdded,
      userId,
      order,
      statement,
      comment,
    });

    res.json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
