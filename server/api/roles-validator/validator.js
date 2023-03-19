const Joi = require('joi');

const validator = (schema) => (payload) => 
schema.validate(payload, {abortEarly: false});


const signupSchema = Joi.object({
	Fname: Joi.string().min(3).max(15).alphanum().required(),
	Lname: Joi.string().min(3).max(15).alphanum().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(3).max(10).required(),
	address: {
		street_address: Joi.string().min(3).max(40).required(),
		city: Joi.string().min(3).max(10).alphanum().required(),
		state: Joi.string().length(2).alphanum().required(),
		zip_code: Joi.string().length(5).pattern(/^[0-9]+$/).required(),
	},
	DOB: Joi.date().required(),
});

const signupAdminSchema = Joi.object({
	Fname: Joi.string().min(3).max(15).alphanum().required(),
	Lname: Joi.string().min(3).max(15).alphanum().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(3).max(10).required(),
	address: {
		street_address: Joi.string().min(3).max(40).required(),
		city: Joi.string().min(3).max(10).alphanum().required(),
		state: Joi.string().length(2).alphanum().required(),
		zip_code: Joi.string().length(5).pattern(/^[0-9]+$/).required(),
	},
	DOB: Joi.date().required(),
	role: Joi.string().min(3).max(7).alphanum().required()
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(3).max(10).required(),
});

const EmailSchema = Joi.object({
	email: Joi.string().email().required(),
});


const updateAdminSchema = Joi.object({
	Fname: Joi.string().min(3).max(15).alphanum().required(),
	Lname: Joi.string().min(3).max(15).alphanum().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(3).max(10),
	address: {
		street_address: Joi.string().min(3).max(40).required(),
		city: Joi.string().min(3).max(10).alphanum().required(),
		state: Joi.string().length(2).alphanum().required(),
		zip_code: Joi.string().length(5).pattern(/^[0-9]+$/).required(),
	},
	DOB: Joi.date().required(),
	role: Joi.string().min(3).max(7).alphanum().required()
});

exports.validateSignup = validator(signupSchema);
exports.validateAdminSignup = validator(signupAdminSchema);
exports.validateLogin = validator(loginSchema);
exports.validateEmail = validator(EmailSchema);
exports.validateUpdateAdmin = validator(updateAdminSchema);
