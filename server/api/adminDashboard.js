const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const Joi = require('joi');
const { ROLE, VERIFY } = require('./roles-validator/roles')
const admin = require('firebase-admin');
const db = admin.firestore();
const { authUser, authRole } = require('./middleware/basicAuth')
const { validateAdminSignup } = require("./roles-validator/validator");
const { sendLoginApproved, sendEmail } = require('./email')

router.get('/', authUser, authRole(ROLE.ADMIN), (req, res) =>{
	res.send('admin dashboard');
});

router.post("/email", authUser, authRole(ROLE.ADMIN), async (req, res) => {
	const {
	  email,
	  subject,
	  message
	} = req.body;

	const userRef = db.collection("users");
	let user = await userRef.where("email", "==", email).get(); //Check if email is in database already
	if (user.empty) {
		return res.status(400).json({ errors: "Email not found" });
	  }

	var found;
  user.forEach((doc) => {
    found = doc.data();
  });
	sendEmail(email, subject, message, found.Fname, found.Lname);
	res.json({msg: `email was sent to ${email}`});
});

router.put("/verify/:email", authUser, authRole(ROLE.ADMIN), async (req, res) => {
const email = req.params.email;
const userRef = db.collection("users");

  let user = await userRef.where("email", "==", email).get();

  if (user.empty) {
    return res.status(400).json({ errors: "Email not found" });
  }

  var found;
  user.forEach((doc) => {
    found = doc.data();
  });
  await db.collection("users").doc(found.id).update({
  verify: VERIFY.VERIFIED
  });

  res.send(`${found.id} is now verified`);

  sendLoginApproved(found.Fname, found.Lname, email);
});

router.post("/register", authUser, authRole(ROLE.ADMIN), async (req, res) => {
	const {
	  Fname,
	  Lname,
	  email,
	  password,
	  address: { street_address, city, state, zip_code },
	  DOB,
	  role
	} = req.body;
	const { error, value } = validateAdminSignup(req.body); //Uses Joi to validate the input
  
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

	if (!user.empty)
	  return res
		.status(400)
		.json({ errors: "This email has already been used." });
  
	const salt = await bcrypt.genSalt(10);
  
	const dateCreated = new Date();
  
	function setRole(role){ //sets the role to the inputted role
		if(user.role == "admin"){
			role = ROLE.ADMIN
		} else if(user.role == "manager"){
			role = ROLE.MANAGER
		} else if(user.role == "basic"){
			role = ROLE.BASIC
		}
		return role
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
  
	await db.collection("users").doc(id).set({
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
	  role: setRole(role)
	});
  
	const payload = {
	  user: {
		id,
		Fname,
		Lname,
		email,
		role: setRole(role)
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