require('dotenv').config()
const PORT = process.env.PORT || 8080

const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('./connect')
const cors = require('cors')
const cookieparser = require('cookie-parser')

const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/usersRouter')
const postRouter = require('./routers/postsRouter')
const commentRouter = require('./routers/commentRouter')

// Connect DB
mongoose.connect(process.env.DB_URL)

// middleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieparser())
app.use(morgan('common'))

// routes
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`)
})
