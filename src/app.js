const logger = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')
const app = express();
const serial = require('./helper/serial')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', indexRouter);


const process = async function(){
  try{
    const result = await serial.process()
    console.log(result)
  }catch(err){
    console.error(err)
  }
}

process()

module.exports = app;
