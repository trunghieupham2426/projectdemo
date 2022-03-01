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
            err.message = 'username should not be empty!';
            break;
          case 'string.min':
            err.message = `username should have at least ${err.local.limit} characters!`;
            break;
          case 'string.max':
            err.message = `username should have at most ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });

      return errors;
    }),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  // phone: phone.string().phoneNumber(),
});

const updateMeSchema = Joi.object({
  phone: phone.string().phoneNumber().empty(),
  age: Joi.number().min(1).max(100).empty(),
});

const classSchema = Joi.object({
  subject: Joi.string().empty(),
  max_student: Joi.number().empty(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  status: Joi.string().valid('open', 'close', 'pending').default('pending'),
}).custom((obj, helper) => {
  const { end_date, start_date } = obj;
  if (new Date(start_date) > new Date(end_date)) {
    throw new Error('end_date must be greater than start_date');
  }
  if (new Date(start_date) < new Date()) {
    throw new Error('start_date must be greater than today');
  }
  return obj;
});

const calendarSchema = Joi.object({
  day_of_week: Joi.string().empty(),
  open_time: Joi.string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .empty(),
  close_time: Joi.string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .error(new Error('invalid time , please use this format HH:MM'))
    .empty()
    .error(new Error('invalid time, please use this format HH:MM')),
}).custom((obj, helper) => {
  const { open_time, close_time } = obj;
  if (close_time < open_time) {
    throw new Error('close_time must greater than open_time');
  }
});

exports.classIdValidate = async (req, res, next) => {
  try {
    await Joi.object({
      class_id: Joi.string()
        .required()
        .trim()
        .empty()
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

exports.calendarValidate = async (req, res, next) => {
  try {
    await calendarSchema.validateAsync(req.body);
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
