var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
  // res.send('respond with a resource');
});

router.get('/cool', function(req, res, next) {
  res.send('Very cool route');
});


module.exports = router;
