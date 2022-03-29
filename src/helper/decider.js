require('dotenv').config({ path: '.env' })
const serial = require('./serial')
const sender = require('./sender')

exports.decide = async() => {
        if(process.env.SERIALMODE === 'online'){
            const val = await sender.send()
            return val
        }else if(process.env.SERIALMODE === 'offline'){
            await serial.process()
            return true
        }else{
            return false
        }
}