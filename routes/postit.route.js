const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { createPost} = require('../controllers/postit.controller')
const { validatePostitInputs } = require('../middlewares/validate')

const router = Router()

router.route('/postits')
.post(authenticate, validatePostitInputs, createPost)

module.exports = router;