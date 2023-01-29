const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const { validateLogin } = require("../../validator");

const admin = require("firebase-admin");
const db = admin.firestore();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const { error, value } = validateLogin(req.body); //Uses Joi to validate the input
  if (error) {
    //If input is invalid list all errors
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.send(errorFull);
  }

  const userRef = db.collection("users");

  let user = await userRef.where("email", "==", email).get();

  if (user.empty) {
    return res.status(400).json({ errors: "Email not found" });
  }

  var found;
  user.forEach((doc) => {
    found = doc.data();
  });

  const matched = await bcrypt.compare(password, found.password);

  if (!matched) {
    return res.status(400).json({ errors: "Invalid password" });
  }

  const payload = {
    user: {
      id: found.id,
      role: found.role,
    },
  };

  jwt.sign(
    payload,
    config.get("jwtpass"),
    { expiresIn: 40000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

module.exports = router;
