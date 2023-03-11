const { Router } = require('express')
const signinRouter = require('./user.signin.route')
const userRouter = require('./user.route')
const postitRouter = require('./postit.route')

const router = Router()

router.use('/v1', signinRouter)
router.use('/v1', userRouter)
router.use('/v1', postitRouter)

module.exports = router;