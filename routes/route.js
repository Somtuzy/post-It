const { Router } = require('express')
const signinRouter = require('./user.signin.route')
const userRouter = require('./user.route')

const router = Router()

router.use('/v1', signinRouter)
router.use('/v1', userRouter)

module.exports = router;