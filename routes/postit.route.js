const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { createPost, updatePost, deletePost, getPost, getPosts, getUserPosts, getUserPostById } = require('../controllers/postit.controller')
const { validatePostitInputs } = require('../middlewares/validate')

const router = Router()

router.route('/postits')
.post(authenticate, validatePostitInputs, createPost)
.get(authenticate, getPosts)

router.route('/postits/:id')
.put(authenticate, updatePost)
.get(authenticate, getPost)
.delete(authenticate, deletePost)

router.route('/users/:userid/postits')
.get(authenticate, getUserPosts)

router.route('/users/:userid/postits/:id')
.get(authenticate, getUserPostById)

module.exports = router;