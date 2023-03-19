const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const { validateLogin, validateEmail } = require("./roles-validator/validator");
const { sendForgotPass } = require("./email");

const admin = require("firebase-admin");
const db = admin.firestore();
const usersRef = db.collection("users");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const { error, value } = validateLogin(req.body); //Uses Joi to validate the input
  if (error) {
    //If input is invalid list all errors
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
	  errorFull.push("\n")
    }
    return res.status(400).json({ errors: errorFull});
  }


  let user = await usersRef.where("email", "==", email).get();

  if (user.empty) {
    return res.status(400).json({ errors: "Email not found" });
  }

  var found;
  user.forEach((doc) => {
    found = doc.data();
  });

  if (found.verify == "unverified") {
    return res.status(401).json({ errors: "Need admin approval before logging in" });
  }

  if (found.status == "deactivated") {
    return res.status(401).json({ errors: "Account needs to be activated before logging in" });
  }

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

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  const { error, value } = validateEmail(req.body); //Uses Joi to validate the input
  if (error) {
    //If input is invalid list all errors
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
	  errorFull.push("\n")
    }
    return res.status(400).json({ errors: errorFull});
  }

  let user = await usersRef.where("email", "==", email).get();

  if (user.empty) {
    return res.status(400).json({ errors: "Email not found" });
  }

  sendForgotPass(email);

  const payload = {
    user: {
      email: email,
      forgotpassword: true
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



router.put("/resetpassword", async (req, res) => {
  const { email, password } = req.body;

  const { error, value } = validateLogin(req.body); //Uses Joi to validate the input
  if (error) {
    //If input is invalid list all errors
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
	  errorFull.push("\n")
    }
    return res.status(400).json({ errors: errorFull});
  }

  let user = await usersRef.where("email", "==", email).get();

  if (user.empty) {
    return res.status(400).json({ errors: "Email not found" });
  }

  var found;
  user.forEach((doc) => {
    found = doc.data();
  });

  if (found.role == "admin" || found.role == "manager") {
    return res.status(401).json({ errors: "To reset your password you need an admin to manually reset it" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

    await db.collection("users").doc(found.id).update({
      password: hashedPassword
    });

    res.send('successfully updated password');
});
module.exports = router;
