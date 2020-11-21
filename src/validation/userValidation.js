const Joi = require('joi');

const signupSchema = Joi.object().keys({
  // name: Joi.string().max(40).required().label('Name'),
  username: Joi.string().alphanum().min(4).max(20).required().label('Username'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/)
    .label('Password')
    .required(),
});

module.exports = { signupSchema };
