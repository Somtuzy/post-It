const { userSchema, postitSchema } = require('../services/joi.service')

// Catching required fields errors when creating a user
const validateUserInputs = (req, res, next) => {
  try {
      const validateInput = userSchema.validate(req.body)

      if(validateInput.error) {
          return res.status(400).send({
            success: false,
            status: 'failed',
            errormessage: validateInput.error.details[0].message
        })
      } else {
        console.log("Validated successfully");
        next()
      } 
  } catch (err) {
        return res.status(400).send({
          message: err,
          status: 'failed'
        })
  }
}

// / Catching required fields errors when creating a postit
const validatePostitInputs = (req, res, next) => {
    try {
        const validateInput = postitSchema.validate(req.body)
  
        if(validateInput.error) {
            return res.status(400).send({
              success: false,
              status: 'failed',
              errormessage: validateInput.error.details[0].message
          })
        } else {
          console.log("Postit validated successfully");
          next()
        } 
    } catch (err) {
          return res.status(400).send({
            message: err,
            status: 'failed'
          })
    }
}
  
module.exports = {validateUserInputs, validatePostitInputs };