const { Router } = require('express')
const { updateUser, deleteUser } = require('../controllers/user.controller') 
const authenticate = require('../middlewares/authentication')

const router = Router()

router.route('/users/:id')
.put(authenticate, updateUser)
.delete(authenticate, deleteUser)

module.exports = router;