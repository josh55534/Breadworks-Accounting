const express=require('express');
const cors=require('cors');
const Joi = require('joi');
const app= express();
app.use(express.json());
app.use(cors());
const { authUser, authRole } = require('././middleware/basicAuth')
const { ROLE } = require('./roles')

const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

//GET
app.use('/api/register', require('./routes/api/register'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/private', require('./routes/api/private'))
app.use('/api/adminDashboard', require('./routes/api/adminDashboard'))


app.get('/', (req, res) =>{
	res.send('Hello');
});


const port = process.env.PORT || 4000;
app.listen(port, ()=> {
	console.log(`Listening on port ${port}`)
});
