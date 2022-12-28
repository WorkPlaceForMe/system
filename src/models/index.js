require('dotenv').config({ path: '.scrt.env' })
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DB, process.env.USERM, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  operatorsAliases: 0,
  logging: false
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.serial = require('./serial.model')(sequelize, Sequelize)
db.account = require('./account.model')(sequelize, Sequelize)

module.exports = db
