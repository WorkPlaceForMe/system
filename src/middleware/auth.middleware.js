const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.srct.env' })

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }

  jwt.verify(token, process.env.SECRETSERVER, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      })
    }
    req.userId = decoded.id
    next()
  })
}


const authJwt = {
  verifyToken: verifyToken,
}
module.exports = authJwt
