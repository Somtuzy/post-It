const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { createPost, updatePost } = require('../controllers/postit.controller')
const { validatePostitInputs } = require('../middlewares/validate')

const router = Router()

router.route('/postits')
.post(authenticate, validatePostitInputs, createPost)

router.route('/postits/:id')
.put(authenticate, updatePost)

module.exports = router;