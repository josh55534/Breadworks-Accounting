const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const { validateSignup } = require("../../validator");
const { ROLE } = require("../../roles");
const admin = require("firebase-admin");
const db = admin.firestore();

router.get("/", (req, res) => {
  res.send("register page");
});

router.post("/", async (req, res) => {
  const {
    Fname,
    Lname,
    email,
    password,
    address: { street_address, city, state, zip_code },
    DOB,
  } = req.body;
  const { error, value } = validateSignup(req.body); //Uses Joi to validate the input

  if (error) {
    //If input is invalid list all errors
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.send(errorFull);
  }

  const userRef = db.collection("users");

  let user = await userRef.where("email", "==", email).get(); //Check if email is in database already
  console.log(user);
  if (!user.empty)
    return res
      .status(400)
      .json({ errors: "This email has already been used." });

  const salt = await bcrypt.genSalt(10);

  const dateCreated = new Date();

  function addZero() {
    //adds a zero in front of months < 10
    if (dateCreated.getMonth() < 10) {
      return 0;
    } else return;
  }

  function sliceYear() {
    //Cuts off the 20 of a year((20)18) and returns the end(18)
    let x = dateCreated.getFullYear();
    return x - 2000;
  }
  const id = `${Fname.charAt(0)}${Lname}${addZero()}${
    //Creates id with first initial of first name, full last name, month and year created
    dateCreated.getMonth() + 1
  }${sliceYear()}`;

  const hashedPassword = await bcrypt.hash(password, salt);

  await db.collection("users").doc(id).set({
    id,
    Fname,
    Lname,
    email,
    password: hashedPassword,
    role: ROLE.BASIC,
    dateCreated,
    address: {
      street_address,
      city,
      state,
      zip_code,
    },
    DOB,
  });

  const payload = {
    user: {
      id,
      Fname,
      Lname,
      email,
      role: ROLE.BASIC,
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
