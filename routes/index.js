var express = require('express');
var mongoose = require('mongoose');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/catalog');
});

module.exports = router;