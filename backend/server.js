require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const { errorHandler, notFoundRoute } = require('./middlewares')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('API Running'))

app.use('/api/users', require('./routes/users'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/profiles', require('./routes/profiles'))

app.use('/public', express.static(path.join(path.resolve(), '/public')))

app.use(notFoundRoute)
app.use(errorHandler)

app.listen(
  process.env.PORT,
  console.log(
    `Server running on port ${process.env.PORT} on ${process.env.NODE_ENV} mode.`
  )
)
