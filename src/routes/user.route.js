const { Router } = require('express')
const { 
    updateUser, 
    deleteUser, 
    getUser, 
    getUsers, 
    getUserByHandle
} = require('../controllers/user.controller')
const { 
    getUserPosts, 
    getUserPostById, 
    getUserPostsByHandle 
} = require('../controllers/postit.controller') 
const { getUserCommentById, getUserComments } = require('../controllers/comment.controller')
const authenticate = require('../middlewares/authentication')

const router = Router()

router.route('/')
.get(authenticate, getUsers)

router.route('/@:handle')
.get(authenticate, getUserByHandle)

router.route('/:id')
.put(authenticate, updateUser)
.delete(authenticate, deleteUser)
.get(authenticate, getUser)

// using the user routes to get their postits
router.route('/@:handle/postits')
.get(authenticate, getUserPostsByHandle)

router.route('/:userid/postits')
.get(authenticate, getUserPosts)

router.route('/:userid/postits/:id')
.get(authenticate, getUserPostById)

// using the user routes to get their comments
router.route('/:userid/postits/:postid/comments')
.get(authenticate, getUserComments)

router.route('/:userid/postits/:postid/comments/:id')
.get(authenticate, getUserCommentById)

module.exports = router;