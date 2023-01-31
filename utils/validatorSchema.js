const joi = require("joi");

exports.userSchema = joi.object({
  fullName: joi.string().min(3).max(50).required(),
  password: joi
    .string()
    .pattern(new RegExp(/^[^0-9][a-zA-Z0-9]{3,30}$/))
    .required(),
  email: joi
    .string()
    .pattern(new RegExp(/^[^0-9][a-zA-Z0-9._%+-]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/))
    .required(),
  role: joi.number(),
  mobile: joi.string().required(),
});

exports.loginSchema = joi.object({
  password: joi
    .string()
    .pattern(new RegExp(/^[^0-9][a-zA-Z0-9]{3,30}$/))
    .required(),
  email: joi
    .string()
    .pattern(new RegExp(/^[^0-9][a-zA-Z0-9._%+-]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/))
    .required(),
});
