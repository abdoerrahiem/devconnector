const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const jwtSecret = config.get('jwtSecret')

// Get registered user -> private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    res.json({ user })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Login user -> private
router.post(
  '/',
  [
    check('email', 'Email is not valid!').isEmail(),
    check('password', 'Password is required!').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials!' }] })
      }

      const passwordMatched = await bcrypt.compare(password, user.password)
      if (!passwordMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials!' }] })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(payload, jwtSecret, { expiresIn: '2hr' }, (err, token) => {
        if (err) throw err

        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error!')
    }
  }
)

module.exports = router
