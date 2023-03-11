const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { createComment, updateComment, deleteComment, getComment, getComments, getUserCommentById } = require('../controllers/comment.controller')
const { validateCommentInputs } = require('../middlewares/validate')

const router = Router()

router.route('/postits/:postid/comments')
.post(authenticate, validateCommentInputs, createComment)
.get(authenticate, getComments)


router.route('/postits/:postid/comments/:id')
.put(authenticate, updateComment)
.get(authenticate, getComment)
.delete(authenticate, deleteComment)

router.route('/users/:userid/postits/:postid/comments/:id')
.get(authenticate, getUserCommentById)

module.exports = router;