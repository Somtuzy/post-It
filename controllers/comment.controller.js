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

    // Updating a comment
    async updateComment(req, res) {
        try {
            const { id } = req.params
            const { content } = req.body
            const userId = req.user.id

            // Finds the comment
            const existingComment = await comment.find({_id: id, deleted: false})
            if(!existingComment) return res.status(404).send({
                message: 'Comment not found'
            })

            if (userId.toString() !== existingComment.author._id.toString()) return res.status(403).send({
                message: 'You are not authorised to edit this comment'
            })

            if(!content) return res.status(403).send({
                message: 'Please provide a content'
            })
            
            const updatedComment = await comment.update(id, {content: content})

            return res.status(200).send({
                message: 'Comment updated',
                post: updatedComment
            })
        } catch (err) {
            return res.send({
                message: err.message
            })
        }
    }
}

module.exports = new CommentController()