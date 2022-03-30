const logger = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')
const app = express();
require('dotenv').config({ path: '.scrt.env' })
const dbInstaller = require('./helper/dbInstaller')
const cors = require('cors')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
function customHeaders (req, res, next) {
  app.disable('X-Powered-By')
  res.setHeader('X-Powered-By', 'Srl-server')
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.header('Access-Control-Allow-Origin', `http://localhost:4200`)
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
  )
  next()
}

app.use(customHeaders)

app.use('/api/v1', indexRouter);


if (process.env.INSTALL === 'true') {
  dbInstaller.process()
}

module.exports = app;
