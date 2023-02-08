const express=require('express');
const cors=require('cors');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

//GET
app.use('/register', require('./register'));
app.use('/login', require('./login'));
app.use('/private', require('./private'))
app.use('/adminDashboard', require('./adminDashboard'))


app.get('/', (req, res) =>{
	res.send('Hello');
});


const port = process.env.PORT || 5000;
app.listen(port, ()=> {
	console.log(`Listening on port ${port}`)
});

