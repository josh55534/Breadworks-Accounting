require('dotenv').config();
var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

function sendEmail(email, subject, message, Fname, Lname){
	const msg={
		'subject':`${subject}`,
		'sender' : {'email':'nickaccounting117@mail.com', 'name':'Nick @ Breadworks'},
		'replyTo' : {'email':'nickaccounting117@mail.com', 'name':'Nick @ Breadworks'},
		'to' : [{'name': `${Fname} ${Lname}`, 'email':`${email}`}],
		'htmlContent' : `<html><body><p>${message}</p></body></html>`,
}

let client = new SibApiV3Sdk.TransactionalEmailsApi();

client.sendTransacEmail(msg)
.then(function(data) {
	console.log(`Email was sent to ${email}`);
  }, function(error) {
console.log(error);
  });
}

function sendRegistertoAdmin(id, email){
const msg={
		'subject':'Breadworks accounting user reqests approval to login',
		'sender' : {'email':'nickaccounting117@mail.com', 'name':'Nick @ Breadworks'},
		'replyTo' : {'email':'nickaccounting117@mail.com', 'name':'Nick @ Breadworks'},
		'to' : [{'name': 'Nick', 'email':'nickaccounting117@mail.com'}],
		'htmlContent' : `<html><body><h3> User: ${id} with Email: ${email} requests to register a new account </h3></body></html>`,
}

let client = new SibApiV3Sdk.TransactionalEmailsApi();

client.sendTransacEmail(msg)
.then(function(data) {
	console.log(`Email was sent to admin`);
  }, function(error) {
console.log(error);
  });
}

function sendLoginApproved(Fname, Lname, email){
const msg ={
	'to' : [{'name': `${Fname} ${Lname}`, 'email':email}],
	'templateId': 1
}

let client = new SibApiV3Sdk.TransactionalEmailsApi();

client.sendTransacEmail(msg)
.then(function(data) {
	console.log(`Email was sent to ${email}`);
  }, function(error) {
console.log(error);
  });

}

module.exports = {
	sendLoginApproved,
	sendRegistertoAdmin,
	sendEmail
}