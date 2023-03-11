const { Router } = require('express')
const authenticate = require('../middlewares/authentication')
const { createComment, updateComment, deleteComment } = require('../controllers/comment.controller')
const { validateCommentInputs } = require('../middlewares/validate')

const router = Router()

router.route('/postits/:postid/comments')
.post(authenticate, validateCommentInputs, createComment)


router.route('/postits/:postid/comments/:id')
.put(authenticate, updateComment)
.delete(authenticate, deleteComment)

module.exports = router;