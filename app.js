const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/uploadedImages');

const app = express();
app.use(cors());

// Database configuration
const config = {
  user: 'owais',
  password: 'awais@456',
  server: 'localhost',
  database: 'imageocr',
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
  authentication:{
    type: 'default',
  },
  pool: { // Connection pooling
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Connect to database
sql.connect(config)
  .then(() => console.log('Connected to database'))
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploadedImages', uploadRouter);

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
