const Joi = require('joi');

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const accountSchema = Joi.object({
  number: Joi.number().integer(),
  order: Joi.string().length(3).pattern(/^[0-9]+$/).required(),
  name: Joi.string().min(3).required(),
  desc: Joi.string().min(3).max(300).required(),
  normalSide: Joi.string().length(1).required(),
  category: Joi.string().min(5).max(11).required(),
  subcategory: Joi.string().min(3).required(),
  balance: Joi.number().precision(2),
  credit: Joi.number().precision(2),
  debit: Joi.number().precision(2),
  assignedUsers: Joi.array().items(Joi.string().min(3).alphanum()),
  comment: Joi.string().min(3).max(300).allow(null, ''),
  statement: Joi.string().length(2).required()
})

const updateAccountSchema = Joi.object({
  number: Joi.number().integer(),
  order: Joi.string().length(3).pattern(/^[0-9]+$/),
  name: Joi.string().min(3).required(),
  desc: Joi.string().min(3).max(300).required(),
  normalSide: Joi.string().length(1).required(),
  category: Joi.string().min(5).max(11).required(),
  subcategory: Joi.string().min(3).required(),
  balance: Joi.number().precision(2),
  credit: Joi.number().precision(2),
  debit: Joi.number().precision(2),
  assignedUsers: Joi.array().items(Joi.string().min(3).alphanum()),
  comment: Joi.string().min(3).max(300).allow(null, ''),
  statement: Joi.string().length(2).required()
})

exports.validateAccount = validator(accountSchema);
exports.validateUpdateAccount = validator(updateAccountSchema);