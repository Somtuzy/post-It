const { model, Schema } = require('mongoose')
const ObjectId = Schema.Types.ObjectId


const commentSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 300,
    },
    postit:  {
        type: ObjectId,
        ref: 'Postit'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Comment = model('Comment', commentSchema)
module.exports = Comment;