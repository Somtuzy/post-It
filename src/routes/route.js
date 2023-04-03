const { Router } = require('express')
const authRouter = require('./auth.route')
const userRouter = require('./user.route')
const postitRouter = require('./postit.route')
const commentRouter = require('./comment.route')
const docsUrl = process.env.DOCS_URL

const router = Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/postits', postitRouter)
router.use('/', commentRouter)

// Redirects to API documentation
router.use('/v1/docs', (req, res) => {
    res.redirect(301, docsUrl)
})

module.exports = router;