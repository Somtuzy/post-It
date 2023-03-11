const { Router } = require('express')
const { signup } = require('../controllers/user.controller') 
const  validateUserInputs = require('../middlewares/validate')

const router = Router()

router.post('/users/signup', validateUserInputs, signup)

module.exports = router;
