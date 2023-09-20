const express = require('express')
const router = express.Router()
const Users = require('./models/index')


Users.find({})
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err, "error")
})

module.exports = router