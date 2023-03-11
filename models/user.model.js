const { model, Schema} = require('mongoose')
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema({
    fullname:{
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        minlength: 3,
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        minlength: 2,
    },
    avatar: String,
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    age: {
        type: Number,
        required: true,
        min: 13
    },
    postits: [{
        type: ObjectId,
        ref: 'Postit'
    }],
    replies: [{
        type: ObjectId,
        ref: 'Comment'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const User = model('User', userSchema)
module.exports = User;