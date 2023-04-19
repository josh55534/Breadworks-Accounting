const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const accountsRef = db.collection('event logs').doc('accounts');
const journalsRef = db.collection('event logs').doc('journals');

// Get all accounts
router.get("/accounts", async (req, res) => {

    try {
      const subcollections = await accountsRef.listCollections();
      const accounts = [];
    
      for (const subcollection of subcollections) {
        const accountId = subcollection.id;
        if (!accounts.includes(accountId)) {
          accounts.push(accountId);
        }
      }
    
      res.json(accounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting event logs" });
    }    
  });


  // Get all journals
router.get("/journals", async (req, res) => {
    

    try {
      const subcollections = await journalsRef.listCollections();
      const journals = [];
    
      for (const subcollection of subcollections) {
        const journalId = subcollection.id;
        if (!journals.includes(journalId)) {
          journals.push(journalId);
        }
      }
    
      res.json(journals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting event logs" });
    }    
  });
  
  

// Get all logs for a specific journal
router.get("/journals/:journalId", async (req, res) => {
    const journalId = req.params.journalId;
  
    try {
      const subcollections = await journalsRef.listCollections();
      const journalLogs = [];
  
      for (const subcollection of subcollections) {
        const snapshot = await subcollection.get();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.journalId === journalId) {
            const journalLog = { ...data, id: doc.id };
            journalLogs.push(journalLog);
          }
        });
      }
  
      res.json(journalLogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting journal logs" });
    }
});

// Get all logs for a specific account
router.get("/accounts/:accountId", async (req, res) => {
    const accountId = req.params.accountId;
  
    try {
      const subcollections = await accountsRef.listCollections();
      const accountLogs = [];
  
      for (const subcollection of subcollections) {
        const snapshot = await subcollection.get();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.accountId === accountId) {
            const accountLog = { ...data, id: doc.id };
            accountLogs.push(accountLog);
          }
        });
      }
  
      res.json(accountLogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting account logs" });
    }
});

  
module.exports = router;
