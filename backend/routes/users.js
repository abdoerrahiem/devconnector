const router = require('express').Router()
const {
  registerUser,
  getUsers,
  loginUser,
  getCurrentUser,
} = require('../controllers/users')
const { auth } = require('../middlewares')

router.route('/login').post(loginUser)
router.route('/').post(registerUser).get(getUsers)
router.route('/me').get(auth, getCurrentUser)

module.exports = router
