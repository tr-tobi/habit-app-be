var express = require('express');
var router = express.Router();
var Users = require('./models/index');
Users.find({})
    .then(function (data) {
    console.log(data);
})
    .catch(function (err) {
    console.log(err, "error");
});
module.exports = router;
