const express=require('express');
const cors=require('cors');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

app.use('/register', require('./register'));
app.use('/login', require('./login'));
app.use('/account', require('./account'))
app.use('/adminDashboard', require('./adminDashboard'))
app.use('/chartOfAccounts', require('./chartOfAccounts'))

app.get('/', (req, res) =>{
	res.send('Welcome to the Breadworks Accounting Home Page');
});


const port = process.env.PORT || 5000;
app.listen(port, ()=> {
	console.log(`Listening on port ${port}`)
});

