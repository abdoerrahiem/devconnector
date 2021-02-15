const express = require('express')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')

const router = express.Router()
const jwtSecret = config.get('jwtSecret')

// Register user -> public
router.post(
  '/',
  [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Email is not valid!').isEmail(),
    check('password', 'Password must be at least 6 characters!').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists!' }] })
      }

      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }, true)

      user = new User({ name, email, password, avatar })
      user.password = await bcrypt.hash(password, 10)

      await user.save()

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
