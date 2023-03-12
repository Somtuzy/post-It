const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { validateCommentInputs } = require('../middlewares/validate')
const { createComment, 
        updateComment, 
        deleteComment, 
        getComment, 
        getComments, 
        getUserCommentById,
        getUserComments
 } = require('../controllers/comment.controller')

const router = Router()

router.route('/postits/:postid/comments')
.post(authenticate, validateCommentInputs, createComment)
.get(authenticate, getComments)


router.route('/postits/:postid/comments/:id')
.put(authenticate, updateComment)
.get(authenticate, getComment)
.delete(authenticate, deleteComment)

router.route('/users/:userid/postits/:postid/comments')
.get(authenticate, getUserComments)

router.route('/users/:userid/postits/:postid/comments/:id')
.get(authenticate, getUserCommentById)

module.exports = router;