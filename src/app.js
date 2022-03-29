const logger = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')
const app = express();
require('dotenv').config({ path: '.env' })
const mysql = require('mysql2/promise')
const db = require('./models')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', indexRouter);

if (process.env.INSTALL === 'true') {
  mysql
    .createConnection({
      user: process.env.USERM,
      password: process.env.PASSWORD,
      host: process.env.HOST
    })
    .then(connection => {
      console.log('Connected to DB...')
      connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB + ';').then(() => {
        console.log('Creating and updating DB...')
        db.sequelize.sync({ force: false, alter: true }).then(() => {
          console.log('DB installed and updated.')
        })
      })
    })
}

module.exports = app;
