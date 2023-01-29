const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const {check, validationResult} = require('express-validator');
const Joi = require('joi');
const { ROLE } = require('../../roles')
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', (req, res) =>{
	res.send('register page');
});


router.post('/',[
	check('Fname', 'Name is required.').not().isEmpty(),
	check('Lname', 'Name is required.').not().isEmpty(),
	check('email', 'Email is not in the correct format.').isEmail(),
	check('password', 'Password must be more than 5 characters.').isLength({min: 5})
], async(req, res) =>{
	const errors = validationResult(req)

	if(!errors.isEmpty()) return res.satus(400).json({errors: errors.array()});

	const {Fname, Lname, email, password} = req.body;

	try {
		const userRef = db.collection('users');

		let user = await userRef.where('email', '==', email).get();
		console.log(user);
		if(!user.empty) return res.status(400).json({errors: 'This email has already been used.'});


		const salt = await bcrypt.genSalt(10);


		const dateCreated = new Date()

		function addZero(){
			if(dateCreated.getMonth() < 10){
			return 0;
 			 }else return }

		function sliceYear(){
			let x = dateCreated.getFullYear()
			return x - 2000;
		}
		  const id = `${Fname.charAt(0)}${Lname}${addZero()}${dateCreated.getMonth()+1}${sliceYear()}`

		const hashedPassword = await bcrypt.hash(password, salt);

		await db.collection('users').doc(id).set({
			id,
			Fname,
			Lname,
			email,
			password: hashedPassword,
			role: ROLE.BASIC,
			dateCreated
		})

		const payload = {
			user: {
				id,
				Fname,
				Lname,
				role: ROLE.BASIC
			}
		}
		jwt.sign(
			payload,
			config.get('jwtpass'),
			{expiresIn: 40000},
			(err, token) =>{
				if(err) throw err;
				res.json({token})
			}

		)

	} catch (error) {
		res.status(500).send('Server error');
	}
});

module.exports = router;