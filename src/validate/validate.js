const Joi = require('joi');
const phone = Joi.extend(require('joi-phone-number'));
const AppError = require('../utils/appError');

const signUpValidateSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(2)
    .max(30)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case 'string.empty':
            err.message = 'Value should not be empty!';
            break;
          case 'string.min':
            err.message = `Value should have at least ${err.local.limit} characters!`;
            break;
          case 'string.max':
            err.message = `Value should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });

      return errors;
    }),

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

const updateMeSchema = Joi.object({
  phone: phone.string().phoneNumber().required(),
  age: Joi.number().min(1).max(100),
});

const classSchema = Joi.object({
  subject: Joi.string().required(),
  max_student: Joi.number().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

exports.classIdValidate = async (req, res, next) => {
  try {
    await Joi.object({
      class_id: Joi.string()
        .required()
        .trim()
        .empty('')
        .error(new AppError('class_id is required and not empty', 401)),
    }).validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

exports.signUpValidate = async (req, res, next) => {
  try {
    await signUpValidateSchema.validateAsync(req.body);

    next();
  } catch (err) {
    next(err);
  }
};

exports.updateMeValidate = async (req, res, next) => {
  try {
    await updateMeSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

exports.classValidate = async (req, res, next) => {
  try {
    await classSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
