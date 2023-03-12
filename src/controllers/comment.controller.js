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

    // Deleting a comment
    async deleteComment(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id
            
            // Finds the comment
            const existingComment = await comment.find({_id: id, deleted: false})
            
            if(!existingComment) return res.status(404).send({
                message: 'Comment not found'
            })

            if (userId.toString() !== existingComment.author._id.toString()) return res.status(403).send({
                message: 'You are not authorised to delete this comment'
            })

            // Deletes the user
            existingComment.deleted = true;
            await existingComment.save()
            
            // Sends a success message and displays the deleted comment
            return res.status(200).send({
                success: true,
                message: 'Comment deleted successfully!',
                data: existingComment
            })
        } catch (err) {
            return res.send({
                error: err,
                message: err.message
            })
        }  
    }

    // Getting one comment by id
    async getComment(req, res) {
        try {
            let { id } = req.params
    
            const existingComment = await comment.find({_id: id, deleted: false})

            // Sends a message if the comment does not exist
            if(!existingComment) return res.status(404).send({
                    success: false,
                    message: 'Comment does not exist'
                })

            // Sends a success message and displays comment
            return res.status(200).send({
                success: true,
                message: 'Comment fetched successfully!',
                data: existingComment
            })
        } catch (err) {
            return res.send({
                error: err,
                message: err.message
            })
        }  
    }

    // Getting all comments
    async getComments(req, res) {
        try {
            const comments = await comment.findAll({deleted: false})

            // Sends a message if no comments exist
            if(!comments) return res.status(404).send({
                    success: false,
                    message: 'There are no comments on your database'
                })

            // Sends a success message and displays comments
            return res.status(200).send({
                success: true,
                message: 'Comments fetched successfully!',
                data: comments
            })
        } catch (err) {
            return res.send({
                error: err,
                message: err.message
            })
        } 
    }

    // Getting a user's comment by id
    async getUserCommentById(req, res) {
        try {
            let { userid, postid, id } = req.params
            const existingComment = await comment.find({_id: id, author: userid, postit: postid, deleted: false})

            // Sends a message if the comment does not exist
            if(!existingComment) return res.status(404).send({
                    success: false,
                    message: 'This comment does not exist'
                })

            // Sends a success message and displays comment
            return res.status(200).send({
                success: true,
                message: 'Comment fetched successfully!',
                data: existingPost
            })
        } catch (err) {
            return res.send({
                error: err,
                message: err.message
            })
        }  
    }

    // Getting all a user's comments
    async getUserComments(req, res) {
        try {
            const { userid, postid } = req.params
            const comments = await comment.findAll({author: userid, postit: postid, deleted: false})

            // Sends a message if no comments exist
            if(!comments) return res.status(404).send({
                    success: false,
                    message: 'This user has no comments'
                })

            // Sends a success message and displays comments
            return res.status(200).send({
                success: true,
                message: 'Comments fetched successfully!',
                data: comments
            })
        } catch (err) {
            return res.send({
                error: err,
                message: err.message
            })
        } 
    }
}

module.exports = new CommentController()