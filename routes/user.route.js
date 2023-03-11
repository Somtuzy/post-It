const { Router } = require('express')
const { updateUser } = require('../controllers/user.controller') 
const authenticate = require('../middlewares/authentication')

const router = Router()

router.route('/users/:id')
.put(authenticate, updateUser)

module.exports = router;