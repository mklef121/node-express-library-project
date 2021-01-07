// the purpose of the website is to provide an online catalog for a small local 
// library, where users can browse available books and manage their accounts.
// books, book instances, and authors.

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var wiki = require('./wiki.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require("./routes/catalog")

var app = express();


//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/library_app';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true}).then((data_base)=>{
	// console.log(process.pid, data_base.disconnect);
	process.once('SIGUSR2', async function () {
		 console.log("Got request to kill");
	 	 await data_base.disconnect();
	     process.kill(process.pid, 'SIGUSR2');
	});
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// db.runCommand( { serverStatus: 1, connections: 1, metrics:0, wiredTiger:0, security:0, network:0,electionMetrics:0,locks:0 } )

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
// ...
app.use('/wiki', wiki);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
