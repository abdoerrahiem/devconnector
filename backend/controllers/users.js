const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

// Register user
exports.registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  let user = await db('users').where({ email }).first()
  if (user) {
    res.status(400)
    throw new Error('Email telah digunakan.')
  }

  const avatar = gravatar.url(email, { s: '200', r: 'x', d: 'retro' })

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const username = email.split('@')[0]

  user = await db('users').insert({
    name,
    username,
    email,
    password: hashedPassword,
    avatar,
  })

  const registeredUser = await db('users').where({ id: user }).first()

  const token = jwt.sign(
    {
      id: registeredUser.id,
      email: registeredUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )

  res.status(201).json({ success: true, token })
})

// Get users
exports.getUsers = expressAsyncHandler(async (req, res) => {
  const users = await db('users').select('id', 'name', 'username', 'email')

  res.json({ success: true, count: users.length, data: users })
})

// Login user
exports.loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await db('users').where({ email }).first()
  if (!user) {
    res.status(404)
    throw new Error('User tidak ditemukan.')
  }

  const passwordMatched = await bcrypt.compare(password, user.password)
  if (!passwordMatched) {
    res.status(401)
    throw new Error('Email dan password tidak cocok.')
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )

  res.status(200).json({ success: true, token })
})


// Get current user
exports.getCurrentUser = expressAsyncHandler(async (req, res) => {
  const user = await db('users').select('id', 'name', 'username', 'email').where({ id: req.user.id}).first()
  if (!user) {
    res.status(404)
    throw new Error('User tidak ditemukan.')
  }

  res.json({ success: true,  data: user })
})