const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { createPost, updatePost, deletePost, getPost } = require('../controllers/postit.controller')
const { validatePostitInputs } = require('../middlewares/validate')

const router = Router()

router.route('/postits')
.post(authenticate, validatePostitInputs, createPost)

router.route('/postits/:id')
.put(authenticate, updatePost)
.get(authenticate, getPost)
.delete(authenticate, deletePost)

module.exports = router;