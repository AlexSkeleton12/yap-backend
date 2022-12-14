var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var rawData = fs.readFileSync('database.json');
var database = JSON.parse(rawData);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/getURL', (req, res) => {
  if (req.get('auth') == 'Xj9ZMHqGR9HqhgDblEE4') {
    res.send('https://youreaputz.net/admindev/prev-' + req.get('auth'));
  } else {
    res.send('https://youreaputz.net/admindev/err');
  }
});

app.get('/getDB', (req, res) => {
  res.json(JSON.stringify(database));
});

app.post('/postDB', (req, res) => {
  database.push(req.body);
  fs.writeFile('database.json', JSON.stringify(database));
});

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
