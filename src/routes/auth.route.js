const { Router } = require('express')
const { signup, login } = require('../controllers/auth.signin') 
const logout = require('../controllers/auth.signout') 
const { recover } = require('../controllers/auth.recover.controller') 
const { validateUserInputs } = require('../middlewares/validate')

const router = Router()

router.post('/login', login)

router.post('/signup', validateUserInputs, signup)

router.post('/recover', recover)

router.post('/logout', logout)

module.exports = router;