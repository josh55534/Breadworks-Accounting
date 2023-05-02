const Joi = require('joi');

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const journalSchema = Joi.object({
  transactions: Joi.array().items(
    Joi.object({
      accountID: Joi.string().required(),
      accountName: Joi.string().required(),
      creditAmount: Joi.number().precision(2),
      debitAmount: Joi.number().precision(2),
      debitAfter: Joi.string().required(),
      creditAfter: Joi.string().required()
    })).required(),
    desc: Joi.string().allow(null, ''),
    date: Joi.date().required(),
    userName: Joi.string().required(),
    file: Joi.any()
})

exports.validateJournal = validator(journalSchema);
