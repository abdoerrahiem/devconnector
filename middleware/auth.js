const jwt = require('jsonwebtoken')
const config = require('config')
const jwtSecret = config.get('jwtSecret')

module.exports = (req, res, next) => {
  const token = req.header('token')

  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied!' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid! ' })
  }
}
