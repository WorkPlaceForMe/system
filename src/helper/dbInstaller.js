require('dotenv').config({ path: '.scrt.env' })
const mysql = require('mysql2/promise')
const db = require('../models')
const account = db.account
const crypt = require('crypto-js')

exports.process = async() => {
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
                const encrypted = crypt.AES.encrypt('gr@ymaticsAdmin312', process.env.SECRETSERVER).toString()
                account.create({
                    id: '0220-1ccc1-aaa88a-bb66bb',
                    username: 'firstAccount',
                    password: encrypted,
                    disabled: 0
                  })
            })
        })
    })
}