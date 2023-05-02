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
const { validateAdminSignup, validateUpdateAdmin } = require("./roles-validator/validator");
const { sendLoginApproved, sendEmail } = require("./email");

const usersRef = db.collection("users");

router.get("/", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send("Admin Dashboard");
});

router.get(
  "/emailsAvailable",
  authUser,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const usersSnapshot = await usersRef.get();

    const emails = usersSnapshot.docs.map((doc) => doc.data().email);
    res.json({ emails });
  }
);

router.get(
  "/userByEmail/:email",
  authUser,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const email = req.params.email;
    let user = await usersRef.where("email", "==", email).get(); //Check if email is in database already
    if (user.empty) {
      return res.status(400).json({ errors: "Email not found" });
    } else {

      var found;
  user.forEach((doc) => {
    found = doc.data();
  });
      res.json({
        Fname: found.Fname,
        Lname: found.Lname,
        email: found.email,
        password: found.password,
        address: found.address,
        DOB: found.DOB,
        role: found.role,
      });
    }
  }
);

router.get("/users", authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const snapshot = await usersRef.get();

  const data = snapshot.docs.map((doc) => {
    const { id, email, role, verify, status } = doc.data();
    return { id, email, role, verify, status };
  });

  res.json(data);
});

router.post("/email", authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const { email, subject, message } = req.body;

  let user = await usersRef.where("email", "==", email).get(); //Check if email is in database already
  if (user.empty) {
    return res.status(400).json({ errors: "Email not found" });
  }

  var found;
  user.forEach((doc) => {
    found = doc.data();
  });
  sendEmail(email, subject, message, found.Fname, found.Lname);
  res.json({ msg: `email was sent to ${email}` });
});

//Verify the user
router.put(
  "/verify/:email",
  authUser,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const email = req.params.email;

    let user = await usersRef.where("email", "==", email).get();

    if (user.empty) {
      return res.status(400).json({ errors: "Email not found" });
    }

    var found;
    user.forEach((doc) => {
      found = doc.data();
    });
    await db.collection("users").doc(found.id).update({
      verify: VERIFY.VERIFIED,
    });

    res.send(`${found.id} is now verified`);

    sendLoginApproved(found.Fname, found.Lname, email);
  }
);

//Activates the user's account
router.put(
  "/activate/:email",
  authUser,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const email = req.params.email;

    let user = await usersRef.where("email", "==", email).get();

    if (user.empty) {
      return res.status(400).json({ errors: "Email not found" });
    }

    var found;
    user.forEach((doc) => {
      found = doc.data();
    });
    await db.collection("users").doc(found.id).update({
      status: STATUS.ACTIVATED,
    });

    res.send(`${found.id} is now activated`);
  }
);

//Deactivates the user's account
router.put(
  "/deactivate/:email",
  authUser,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const email = req.params.email;

    let user = await usersRef.where("email", "==", email).get();

    if (user.empty) {
      return res.status(400).json({ errors: "Email not found" });
    }

    var found;
    user.forEach((doc) => {
      found = doc.data();
    });
    await db.collection("users").doc(found.id).update({
      status: STATUS.DEACTIVATED,
    });

    res.send(`${found.id} is now deactivated`);
  }
);

router.put(
  "/update/:email",
  authUser,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const email = req.params.email;

    let user = await usersRef.where("email", "==", email).get();

    if (user.empty) {
      return res.status(400).json({ errors: "Email not found" });
    }

    var found;
    user.forEach((doc) => {
      found = doc.data();
    });

    const { error, value } = validateUpdateAdmin(req.body); //Uses Joi to validate the input

    if (error) {
      //If input is invalid list all errors
      const errorFull = [];
      for (x = 0; x < error.details.length; x++) {
        errorFull.push(error.details[x].message);
      }
      return res.status(400).json({ errors: errorFull });
    }

    const updatedUser = {
      Fname: req.body.Fname || found.Fname,
      Lname: req.body.Lname || found.Lname,
      email: req.body.email || found.email,
      address: {
        street_address:
          req.body.address?.street_address || found.address?.street_address,
        city: req.body.address?.city || found.address?.city,
        state: req.body.address?.state || found.address?.state,
        zip_code: req.body.address?.zip_code || found.address?.zip_code,
      },
      DOB: req.body.DOB || found.DOB,
      role: req.body.role || found.role,
    };

    await db.collection("users").doc(found.id).update(updatedUser);

    res.send(`${found.id} is now updated`);
  }
);

router.post("/register", authUser, authRole(ROLE.ADMIN), async (req, res) => {
  const {
    Fname,
    Lname,
    email,
    password,
    address: { street_address, city, state, zip_code },
    DOB,
    role,
  } = req.body;
  const { error, value } = validateAdminSignup(req.body); //Uses Joi to validate the input

  if (error) {
    //If input is invalid list all errors
    const errorFull = [];
    for (x = 0; x < error.details.length; x++) {
      errorFull.push(error.details[x].message);
    }
    return res.status(400).json({ errors: errorFull });
  }

  let user = await usersRef.where("email", "==", email).get(); //Check if email is in database already

  if (!user.empty)
    return res
      .status(400)
      .json({ errors: "This email has already been used." });

  const salt = await bcrypt.genSalt(10);

  const dateCreated = new Date();

  function setRole(role) {
    //sets the role to the inputted role
    if (user.role == "admin") {
      role = ROLE.ADMIN;
    } else if (user.role == "manager") {
      role = ROLE.MANAGER;
    } else if (user.role == "basic") {
      role = ROLE.BASIC;
    }
    return role;
  }

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

  await db
    .collection("users")
    .doc(id)
    .set({
      id,
      Fname,
      Lname,
      email,
      password: hashedPassword,
      dateCreated,
      address: {
        street_address,
        city,
        state,
        zip_code,
      },
      DOB,
      role: setRole(role),
      verify: VERIFY.UNVERIFIED,
      status: STATUS.ACTIVATED,
    });
res.send('Successfully Registered User')


});

module.exports = router;
