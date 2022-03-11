const Joi = require('joi');
const phone = Joi.extend(require('joi-phone-number'));
const AppError = require('../utils/ErrorHandler/appError');

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

  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .error(
      new AppError('invalid password , must contain at least 6 characters', 400)
    ),

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
  maxStudent: Joi.number().empty(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  status: Joi.string().valid('open', 'close', 'pending').default('pending'),
}).custom((obj, helper) => {
  const { endDate, startDate } = obj;
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error('endDate must be greater than startDate');
  }
  if (new Date(startDate) < new Date()) {
    throw new Error('startDate must be greater than today');
  }
  return obj;
});

const calendarSchema = Joi.object({
  dayOfWeek: Joi.string().empty(),
  openTime: Joi.string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .empty()
    .error(new AppError('invalid time , please use this format HH:MM', 400)),
  closeTime: Joi.string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .empty()
    .error(new AppError('invalid time , please use this format HH:MM', 400)),
}).custom((obj, helper) => {
  const { openTime, closeTime } = obj;
  if (closeTime < openTime) {
    throw new Error('closeTime must greater than openTime');
  }
});

exports.classIdValidate = async (req, res, next) => {
  try {
    await Joi.object({
      classId: Joi.string()
        .required()
        .trim()
        .empty()
        .error(new AppError('classId is required and not empty', 400)),
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
