const BaseService = require('./base.service')
const Users = require('../models/user.model')

class UserService extends BaseService {
    constructor(model) {
        super(model)
    }

    async find(filter) {
        return await this.model.findOne(filter, '-postits -replies -password -deleted')
    }

    async findWithDetails(filter) {
        return await this.model.findOne(filter)
    }

    async findAll(filter) {
        return await this.model.find(filter, '-postits -replies -password -deleted')
    }

    async updateOne(filter, data) {
        return await this.model.updateOne(filter, {$push: {postits: data }})
    }
}

const user = new UserService(Users)
module.exports = user;