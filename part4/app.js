const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)


module.exports = app