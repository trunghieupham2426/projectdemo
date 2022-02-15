const Joi = require('joi');
const phone = Joi.extend(require('joi-phone-number'));

const userSchemaValidate = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))

    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  // phone: phone.string().phoneNumber(),
});

module.exports = userSchemaValidate;
