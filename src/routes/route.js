const { Router } = require('express')
const signinRouter = require('./user.signin.route')
const userRouter = require('./user.route')
const postitRouter = require('./postit.route')
const commentRouter = require('./comment.route')
const docsUrl = process.env.DOCS_URL

const router = Router()

router.use('/v1', signinRouter)
router.use('/v1', userRouter)
router.use('/v1', postitRouter)
router.use('/v1', commentRouter)

// Redirects to API documentation
router.use('/v1/docs', (req, res) => {
    res.redirect(301, docsUrl)
})

module.exports = router;