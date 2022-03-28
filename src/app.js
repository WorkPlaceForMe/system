var logger = require('morgan');
var express = require('express');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var app = express();
const si = require('systeminformation')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', indexRouter);

console.log('Started server')

si.getStaticData()
  .then(data => {
      console.log(data.uuid.os,data.uuid.hardware,data.os.hostname, data.diskLayout[0].size, data.versions.kernel, data.system.model, data.version, data.diskLayout[0].serialNum)
    })
  .catch(error => console.error(error))

module.exports = app;
