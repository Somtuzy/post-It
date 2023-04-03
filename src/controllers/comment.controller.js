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
            const existingPostit = await postit.find({_id: postid, deleted: false})
            
            if(!existingPostit) return res.status(404).json({
                message: `Oops, we couldn't find the postit you're trying to reply to as it does not exist or may have been deleted by its author!`,
                success: false
            })

            const newComment = await comment.create({author: existingUser._id, content, postit: existingPostit._id})
            await newComment.save()

            await postit.updateOne({_id: existingPostit._id}, newComment._id)
            await user.updateOne({_id: existingUser._id}, newComment._id)

            return res.status(201).json({
                message: `Your comment has been sent successfully!`,
                success: true,
                data: newComment
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }
    }

    // Updating a comment
    async updateComment(req, res) {
        try {
            const { id } = req.params
            const { content } = req.body
            const userId = req.user.id

            if(!content) return res.status(401).json({
                message: `Please write your comment`,
                success: false
            })

            // Finds the comment
            const existingComment = await comment.find({_id: id, deleted: false})
            if(!existingComment) return res.status(404).json({
                message: `Oops, we couldn't find your comment as it does not exist or may have already been deleted by you!`,
                success: false
            })

            if (userId !== existingComment.author._id.toString()) return res.status(403).json({
                message: `You cannot edit this comment because you're not the author!`,
                success: false
            })

            const updatedComment = await comment.update(id, {content: content})

            return res.status(200).json({
                message: `Your comment was updated successfully!`,
                success: true,
                data: updatedComment
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
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
            if(!existingComment) return res.status(404).json({
                message: `Oops, we couldn't find your comment as it does not exist or may have already been deleted by you!`,
                success: false
            })

            if (userId !== existingComment.author._id.toString()) return res.status(403).json({
                message: `You cannot delete this comment because you're not the author`,
                success: false
            })

            // Deletes the comment
            existingComment.deleted = true;
            await existingComment.save()
            
            // Sends a success message and displays the deleted comment
            return res.status(200).json({
                message: `Your comment was deleted successfully!`,
                success: true,
                data: existingComment
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }

    // Getting one comment by id
    async getComment(req, res) {
        try {
            const { id } = req.params
            const existingComment = await comment.find({_id: id, deleted: false})

            // Sends a message if the comment does not exist
            if(!existingComment) return res.status(404).json({
                    message: `Oops, we couldn't find this comment as it does not exist or may have been deleted by its author`,
                    success: false
                })

            // Sends a success message and displays comment
            return res.status(200).send({
                message: `Comment fetched successfully!`,
                success: true,
                data: existingComment
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }

    // Getting all comments
    async getComments(req, res) {
        try {
            const comments = await comment.findAll({deleted: false})

            // Sends a message if no comments exist
            if(!comments) return res.status(404).json({
                    message: `Oops, there are no comments to display yet`,
                    success: false
                })

            // Sends a success message and displays comments
            return res.status(200).json({
                message: `All comments fetched successfully!`,
                success: true,
                data: comments
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        } 
    }

    // Getting a user's comment by id
    async getUserCommentById(req, res) {
        try {
            const { userid, postid, id } = req.params
            const existingUser = await user.find({_id: userid})
            const existingPost = await postit.find({_id: postid})

            if(!existingPost && !existingUser) return res.status(404).json({
                message: `Oops, it seems like you're trying to fetch a resource that doesn't exist`,
                success: false
            })

            const existingComment = await comment.find({_id: id, author: userid, postit: postid, deleted: false})

            // Sends a message if the comment does not exist
            if(!existingComment) return res.status(404).json({
                    message: `Oops, we couldn't find this comment as it does not exist or may have been deleted by its author`,
                    success: false
                })

            // Sends a success message and displays comment
            return res.status(200).json({
                message: `Comment fetched successfully!`,
                success: true,
                data: existingComment
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }

    // Getting all a user's comments
    async getUserComments(req, res) {
        try {
            const { userid, postid } = req.params
            const existingPost = await postit.find({_id: postid})
            const existingUser = await user.find({_id: userid})
            
            if(!existingPost && !existingUser) return res.status(404).json({
                message: `Oops, it seems like you're trying to fetch a resource that doesn't exist`,
                success: false
            })

            const comments = await comment.findAll({author: userid, postit: postid, deleted: false})

            // Sends a message if no comments exist
            if(!comments) return res.status(404).json({
                    message: `Oops, it seems like this user has no comments`,
                    success: false
                })

            // Sends a success message and displays comments
            return res.status(200).json({
                message: `Comments fetched successfully!`,
                success: true,
                data: comments
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        } 
    }
}

module.exports = new CommentController()