const path = require('path')
const express = require('express')
const mongoDB = require('./config/mongoDB')
const app = express()

mongoDB()

app.use(express.json())

app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/posts', require('./routes/posts'))

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
