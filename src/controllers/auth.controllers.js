const db = require('../models')
require('dotenv').config({ path: '.srct.env' })
const Account = db.account
const crypt = require('crypto-js')
const jwt = require('jsonwebtoken')

exports.login = (req, res) => {
    Account.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => {
        if (!user) {
          return res
            .status(404)
            .send({ success: false, message: 'User is not in the records', type: 'user' })
        }
        let key, keyRcvd
        let passwordIsValid = false
        try{
            const bytesRcvd  = crypt.AES.decrypt(user.password, process.env.SECRETSERVER)
            key = bytesRcvd.toString(crypt.enc.Utf8)
            
        }catch(err){
            console.error(err)
        }
        try{    
            const bytesRcvd  = crypt.AES.decrypt(req.body.snd, process.env.SECRETSERVER)
            keyRcvd = bytesRcvd.toString(crypt.enc.Utf8)
            
        }catch(err){
            console.error(err)
        }

        if(key === keyRcvd){
            passwordIsValid = true
        }

        if (!passwordIsValid) {
          return res.status(400).send({
            success: false,
            message: 'Invalid Password',
            type: 'password'
          })
        }
        if (user.disabled === 1) {
          return res.status(401).send({
            success: false,
            message: 'This account has been disabled, please get in contact with the Administator.',
            type: 'disable'
          })
        }
        const exp = 43200
  
        const token = jwt.sign(
          { id: user.id  },
          process.env.SECRETSERVER,
          {
            expiresIn: exp // 12 hours
          }
        )
  
        res.status(200).send({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            accessToken: token
          }
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({ success: false, message: err.message })
      })
  }

exports.check = (req, res) => {
  res.status(200).send({ success: true, message: 'Session still active' })
}

exports.info = (req, res) => {
  res.status(200).send({ success: true, message: 'Information of server' })
}