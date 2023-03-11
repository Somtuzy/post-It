const { model, Schema} = require('mongoose')
const ObjectId = Schema.Types.ObjectId

const postitSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
    },
    content:{
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 300,
    },
    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Postit = model('Postit', postitSchema)
module.exports = Postit;