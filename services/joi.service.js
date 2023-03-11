const Joi = require('joi');

 // Checking the user schema fields against pre-set conditions
 const userSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required().lowercase(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  age: Joi.number().integer().min(18).required()
});


module.exports = userSchema;