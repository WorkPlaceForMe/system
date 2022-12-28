require('dotenv').config({ path: '.scrt.env' })
const serial = require('./serial')
const sender = require('./sender')

exports.decide = async() => {
        if(process.env.SERIALMODE === 'online'){
            const val = await sender.send()
            return val
        }else if(process.env.SERIALMODE === 'offline'){
            const val = await serial.process()
            return val
        }else{
            return false
        }
}