const { log } = require('console')
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

            if(!content) return res.status(401).json({
                message: `Please write your postit!`,
                success: false
            })
            
            let newPost = await postit.create({author: existingUser._id, content})
            await newPost.save()

            await user.updateOne({_id: existingUser._id}, newPost)

            newPost = await postit.find({_id: newPost._id})

            return res.status(200).json({
                message: `Your postit has been sent successfully!`,
                success: true,
                data: newPost
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
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

            if(!existingPost) return res.status(404).json({
                message: `Oops, we couldn't find this postit as it does not exist or may have already been deleted by you!`,
                success: false
            })
            
            if (userId !== existingPost.author) return res.status(403).json({
                message: `You cannot edit this postit because you're not the author`,
                success: false,
            })
            
            if (!content) return res.status(401).json({
                message: `Please write your postit`,
                success: false
            })
            
            const updatedPost = await postit.update(id, {content: content})

            return res.status(200).json({
                message: `Your postit has been updated successfully!`,
                success: true,
                data: updatedPost
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
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

            if(!existingPost) return res.status(404).json({
                message: `Oops, we couldn't find this postit as it does not exist or may have already been deleted by you!`,
                success: false
            })

            if (userId !== existingPost.author) return res.status(403).json({
                message: `You cannot delete this postit because you're not the author`,
                success: false
            })

            // Deletes the postit
            existingPost.deleted = true;
            await existingPost.save()
            
            // Sends a success message and displays the deleted postit
            return res.status(200).json({
                message: `Your postit was deleted successfully!`,
                success: true,
                data: existingPost
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }

    // Getting one postit by id
    async getPost(req, res) {
        try {
            let { id } = req.params
            const existingPost = await postit.find({_id: id, deleted: false})

            // Sends a message if the specified postit does not exist
            if(!existingPost) return res.status(404).json({
                    message: `Oops, we couldn't find this postit as it does not exist or may have been deleted by its author!`,
                    success: false
                })

            // Sends a success message and displays postit
            return res.status(200).json({
                message: `Postit fetched successfully!`,
                success: true,
                data: existingPost
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }

    // Getting all postits
    async getPosts(req, res) {
        try {
            const postits = await postit.findAll({deleted: false})

            // Sends a message if no postits exist
            if(!postits) return res.status(404).json({
                    message: `Oops, there are no postits to display yet!`,
                    success: false
                })

            // Sends a success message and displays postits
            return res.status(200).json({
                message: `Postits fetched successfully!`,
                success: true,
                data: postits
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        } 
    }

    // Getting a user's postits
    async getUserPosts(req, res) {
        try {
            const { userid } = req.params
            const existingUser = await user.find({_id: userid})

            if(!existingUser) return res.status(404).json({
                message: `Oops, it seems like you're trying to fetch a resource that doesn't exist`,
                success: false
            })

            const postits = await postit.findAll({author: userid, deleted: false})

            // Sends a message if no postits exist
            if(!postits) return res.status(404).json({
                    message: `Oops, it seems like this user has no postits to display`,
                    success: false
                })

            // Sends a success message and displays postits
            return res.status(200).json({
                message: `Postits fetched successfully!`,
                success: true,
                data: postits
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        } 
    }

    // Getting a user's postit by id
    async getUserPostById(req, res) {
        try {
            const { userid, id } = req.params
            const existingUser = await user.find({_id: userid})
            
            if(!existingUser) return res.status(404).json({
                message: `Oops, it seems like you're trying to fetch a resource that doesn't exist`,
                success: false
            })

            const existingPost = await postit.find({_id: id, author: userid, deleted: false})

            // Sends a message if the specified postit does not exist
            if(!existingPost) return res.status(404).json({
                    message: `Oops, we couldn't find this postit as it does not exist or may have been deleted by its author!`,
                    success: false
            })

            // Sends a success message and displays postit
            return res.status(200).json({
                message: `Postit fetched successfully!`,
                success: true,
                data: existingPost
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }

    // Getting a user's postits by handle
    async getUserPostsByHandle(req, res) {
        try {
            const { handle } = req.params
            const existingUser = await user.find({username: handle})

            if(!existingUser) return res.status(404).send({
                success: false,
                message: `Oops, it seems like this user does not exist`
            })

            const existingPosts = await postit.findAll({author: existingUser._id, deleted: false})

            // Sends a message if the specified postit does not exist
            if(!existingPosts) return res.status(404).json({
                    message: `Oops, it seems like this user has no postits to display`,
                    success: false
                })

            // Sends a success message and displays postit
            return res.status(200).json({
                message: `Postits fetched successfully!`,
                success: true,
                data: existingPosts
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }  
    }
}

module.exports = new PostitController()