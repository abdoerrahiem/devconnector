const express = require('express')
const mongoDB = require('./config/mongoDB')
const app = express()

mongoDB()

app.use(express.json())

app.get('/', (req, res) => res.send('API running...'))

app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/posts', require('./routes/posts'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
