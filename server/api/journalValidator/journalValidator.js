const Joi = require('joi');

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const journalSchema = Joi.object({
  transactions: Joi.array().items(
    Joi.object({
      accountID: Joi.string().required(),
      creditAmount: Joi.number().precision(2),
      debitAmount: Joi.number().precision(2)
    })).required(),
    desc: Joi.string().required(),
    date: Joi.string().required(),
    userName: Joi.string().required(),
})

exports.validateJournal = validator(journalSchema);