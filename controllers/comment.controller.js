const comment = require('../services/comment.service')
const user = require('../services/user.service')
const postit = require('../services/postit.service')

class CommentController{
    // Creating a comment
    async createComment(req, res) {
        try {
            const { content } = req.body
            const userId = req.user.id
            const { postid } = req.params

            // Finds the user making the comment
            const existingUser = await user.find({_id: userId, deleted: false})
            const existingpostit = await postit.find({_id: postid, deleted: false})
            
            if(!existingpostit) return res.status(404).send({
                message: 'You cannot reply to this postit as it seems to have been deleted'
            })

            const newComment = await comment.create({author: existingUser._id, content, postit: existingpostit._id})
            await newComment.save()

            await postit.updateOne({_id: existingpostit._id}, newComment._id)
            await user.updateOne({_id: existingUser._id}, newComment._id)

            return res.status(200).send({
                message: 'reply sent successfully!',
                comment: newComment
            })
        } catch (err) {
            return res.send({
                message: err.message
            })
        }
    }
}

module.exports = new CommentController()