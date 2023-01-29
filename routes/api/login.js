const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const {check, validationResult} = require('express-validator');

const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/', [
	check('email', 'Email is not in the correct format.').isEmail(),
	check('password', 'Password is required.').exists()
], async(req, res) =>{
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()})
	}
	const {email, password} = req.body

	try {
		const userRef = db.collection('users');

		let user = await userRef.where('email', '==', email).get()

		if(user.empty){
			return res.status(400).json({errors: 'Email not found'})
		}

		var found;
		user.forEach((doc) =>{
			found = doc.data()
		})

		const matched = await bcrypt.compare(password, found.password)

		if(!matched){
			return res.status(400).json({errors: 'Invalid password'})
		}

		const payload = {
			user: {
				id: found.id,
				role: found.role,
			}
		}

		jwt.sign(
			payload,
			config.get('jwtpass'),
			{expiresIn: 40000},
			(err, token) => {
				if (err) throw err;
				res.json({ token })
			}
		)
	} catch (error) {
		res.status(500).send('Server error')
		
	}
});

module.exports = router;