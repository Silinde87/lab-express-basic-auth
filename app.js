require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const DB_URL = 'mongodb://localhost/express-basic-auth-dev';

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Session middleware
app.use(
    session({
      secret: "basic-auth-secret",
      resave: true, // Vuelva a guardar,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
      store: MongoStore.create({
        mongoUrl: DB_URL
      })
    })
  )

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const privateRouter = require('./routes/private-routes');
app.use('/profile', privateRouter);

module.exports = app;
