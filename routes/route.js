const { Router } = require('express')
const signinRouter = require('./user.signin.route')

const router = Router()

router.use('/v1', signinRouter)

module.exports = router;