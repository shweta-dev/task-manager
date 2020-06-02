const express = require('express')
require('./db/mongoose');
const userrouter = require('./routers/users.js')
const taskrouter = require('./routers/tasks.js')
const app = express()
//express

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)


const User = require('./model/users.js')
const Task = require('./model/tasks.js')

module.exports = app