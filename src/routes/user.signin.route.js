const { Router } = require('express')
const { signup, login } = require('../controllers/user.controller') 
const { recover } = require('../controllers/user.recover.controller') 
const { validateUserInputs } = require('../middlewares/validate')

const router = Router()

router.post('/users/login', login)

router.post('/users/signup', validateUserInputs, signup)

router.post('/users/recover', recover)

module.exports = router;