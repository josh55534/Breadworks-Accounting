const express=require('express');
const router = express.Router();
const { authUser, authRole } = require('./middleware/basicAuth')

const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/', authUser,  async(req, res) => {
	try {
		const userRef = db.collection('users')

		const user = await userRef.where('id', '==', req.user.id).get();

		var result;

		user.forEach((doc) => {
			result = doc.data();
		});

		res.json({name: result.name, email: result.email, id: result.id});
	} catch (error) {
		res.status(500).send('Server error')
	}
})

module.exports = router;