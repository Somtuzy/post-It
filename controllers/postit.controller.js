const postit = require('../services/postit.service')
const user = require('../services/user.service')

class PostitController{
    // Creating a postit
    async createPost(req, res) {
        try {
            const { content } = req.body
            const userId = req.user.id

            // Finds the user making the postit request
            const existingUser = await user.find({_id: userId, deleted: false})
            
            let newPost = await postit.create({author: existingUser._id, content})
            await newPost.save()

            await user.updateOne({_id: existingUser._id}, newPost)

            newPost = await postit.find({_id: newPost._id})

            return res.status(200).send({
                message: 'Post created',
                post: newPost
            })
        } catch (err) {
            return res.send({
                message: err.message
            })
        }
    }

    // Updating a postit
    async updatePost(req, res) {
        try {
            const { id } = req.params
            const { content } = req.body
            const userId = req.user.id

            // Finds the post
            const existingPost = await postit.find({_id: id})
            if(!existingPost) return res.status(404).send({
                message: 'post not found'
            })

            if (userId.toString() !== existingPost.author._id.toString()) return res.status(403).send({
                message: 'you are not authorised to edit this post'
            })

            if (!content) return res.status(403).send({
                message: 'content cannot be empty'
            })
            
            const updatedPost = await postit.update(id, {content: content})

            return res.status(200).send({
                message: 'Post updated',
                post: updatedPost
            })
        } catch (err) {
            return res.send({
                message: err.message
            })
        }
    }

     // Deleting a postit
     async deletePost(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id

            // Finds the postit
            const existingPost = await postit.find({_id: id})
            if(!existingPost) return res.status(404).send({
                message: 'post not found'
            })

            if (userId.toString() !== existingPost.author._id.toString()) return res.status(403).send({
                message: 'you are not authorised to delete this postit'
            })

            // Deletes the postit
            existingPost.deleted = true;
            await existingPost.save()
            
            // Sends a success message and displays the deleted postit
            return res.status(200).send({
                success: true,
                message: 'Postit deleted successfully!',
                data: existingPost
            })
        } catch (err) {
            return res.send({
                error: err,
                message: err.message
            })
        }  
    }
}

module.exports = new PostitController()