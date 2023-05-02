const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { authUser, authRole } = require("./middleware/basicAuth");

const accountsRef = db.collection('accounts');

router.get("/totalassets", authUser, async (req, res) => {
    try {
        const querySnapshot = await accountsRef.get();
        let totalAssets = 0;

        querySnapshot.forEach((doc) => {
          const accountData = doc.data();
          if (accountData.category === "assets") {
            totalAssets += accountData.balance;
          }
        });

        res.json({ totalAssets });
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while retrieving the total assets.");
      }
  })

  router.get("/totalliabilities", authUser, async (req, res) => {
    try {
        const querySnapshot = await accountsRef.get();
        let totalLiabilities = 0;

        querySnapshot.forEach((doc) => {
          const accountData = doc.data();
          if (accountData.category === "liabilities") {
            totalLiabilities += accountData.balance;
          }
        });

        res.json({ totalLiabilities });
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while retrieving the total liabilities.");
      }
  })

  router.get("/totalarplusinventory", authUser, async (req, res) => {
    try {
        const querySnapshot = await accountsRef.get();
        let totalARplusInventory = 0;

        querySnapshot.forEach((doc) => {
          const accountData = doc.data();
          if (accountData.name === "Merchandise Inventory") {
            totalARplusInventory += accountData.balance;
          }
        });

        querySnapshot.forEach((doc) => {
            const accountData = doc.data();
            if (accountData.name === "Accounts Receivable") {
              totalARplusInventory += accountData.balance;
            }
          });

        res.json({ totalARplusInventory });
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while retrieving the total liabilities.");
      }
  })

  router.get("/netincome", authUser, async (req, res) => {
    try {
        const querySnapshot = await accountsRef.get();
        let netIncome = 0;
        let revenue = 0;
        let expense = 0;

        querySnapshot.forEach((doc) => {
          const accountData = doc.data();
          if (accountData.name === "Merchandise Revenue") {
            revenue += accountData.balance;
          }
        });

        querySnapshot.forEach((doc) => {
            const accountData = doc.data();
            if (accountData.name === "Merchandise Expense") {
              expense += accountData.balance;
            }
          });

          netIncome = revenue - expense;
        res.json({ netIncome });
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while retrieving the total liabilities.");
      }
  })

module.exports = router;