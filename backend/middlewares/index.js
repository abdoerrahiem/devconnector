const jwt = require('jsonwebtoken')
const db = require('../config/db')

exports.errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    success: false,
    message: error.message,
  })
}

exports.notFoundRoute = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

exports.auth = async (req, res, next) => {
  let token = req.headers.authorization

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await db('users').where({ id: decoded.id }).first()

      next()
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token tidak valid.' })
    }
  } else {
    res.status(401).json({ success: false, message: 'Akses ditolak.' })
  }
}
