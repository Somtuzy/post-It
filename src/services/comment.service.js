const BaseService = require('./base.service')
const Comments = require('../models/comment.model')

class CommentService extends BaseService {
    constructor(model) {
        super(model);
    }

    async find(filter) {
        return await this.model.findOne(filter)
        .sort({createdAt: -1})
        .populate({path: 'author', select: 'username'})
        .populate({
            path: 'postit',
            select: 'content',
            match: {deleted: false},
            populate: {
                path: 'author',
                select: 'username',
                match: {deleted: false}
            }
        })
        .exec();
    }

    async findAll(filter) {
        return await this.model.find(filter)
        .sort({createdAt: -1})
        .populate({path: 'author', select: 'username'})
        .populate({
            path: 'postit',
            select: 'content',
            match: {deleted: false},
            populate: {
                path: 'author',
                select: 'username',
                match: {deleted: false}
            }
        })
        .exec();
    }

    // async updateMany(filter, data) {
    //     return await this.model.updateMany(filter, data)
    // }
}

const comment = new CommentService(Comments)
module.exports = comment;