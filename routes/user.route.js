const { Router } = require('express')
const { updateUser, deleteUser, getUser } = require('../controllers/user.controller') 
const authenticate = require('../middlewares/authentication')

const router = Router()

router.route('/users/:id')
.put(authenticate, updateUser)
.delete(authenticate, deleteUser)
.get(authenticate, getUser)

module.exports = router;