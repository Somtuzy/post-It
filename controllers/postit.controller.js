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
}

module.exports = new PostitController()