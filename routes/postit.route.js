const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { validatePostitInputs } = require('../middlewares/validate')
const { 
    createPost, 
    updatePost,
    deletePost, 
    getPost, 
    getPosts, 
    getUserPosts, 
    getUserPostById, 
    getUserPostsByHandle 
} = require('../controllers/postit.controller')

const router = Router()

router.route('/postits')
.post(authenticate, validatePostitInputs, createPost)
.get(authenticate, getPosts)

router.route('/postits/:id')
.put(authenticate, updatePost)
.get(authenticate, getPost)
.delete(authenticate, deletePost)


router.route('/users/@:handle/postits')
.get(authenticate, getUserPostsByHandle)

router.route('/users/:userid/postits')
.get(authenticate, getUserPosts)

router.route('/users/:userid/postits/:id')
.get(authenticate, getUserPostById)

module.exports = router;