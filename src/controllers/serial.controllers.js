require('dotenv').config({ path: '.srct.env' })
const crypt = require('crypto-js')
const db = require('../models')
const Serial = db.serial
const { v4: uuidv4 } = require('uuid');

exports.check = async (req, res) => {
    const data = req.body
    const bytes  = crypt.AES.decrypt(data.snd, process.env.SECRETLOCAL)
    let comparison = bytes.toString(crypt.enc.Utf8).split('/|')
    Serial.findOne({
        where: {
          serial: comparison[0]
        }
      })
        .then(serial => {
            if (!serial) {
                // console.log("Writting serial key...")
                // let ser = comparison.shift();
                // const hrdw = comparison.join('/|')
                // const encrypted = crypt.AES.encrypt(hrdw, process.env.SECRETSERVER).toString()
                // return Serial.create({
                //     serial: ser,
                //     uuidOS: comparison[0],
                //     uuidHardware: comparison[1],
                //     osHostname: comparison[2],
                //     diskSize: comparison[3],
                //     kernel: comparison[4],
                //     systemModel: comparison[5],
                //     version: comparison[6],
                //     diskSerial: comparison[7],
                //     hardware: encrypted
                //   })
                //     .then(_serial => {
                //         result = "Successfully wrote: Serial saved."
                //         console.log(result)
                //         let value = crypt.AES.encrypt('true', process.env.SECRETLOCAL).toString()
                //         res.status(201).send({ success: true, message: 'Serial has been registered successfully.', auth: value })
                //     })
                //     .catch(err => {
                //         result = "Unsuccessfully wrote: Database failled saving."
                //         console.log(result)
                //         let value = crypt.AES.encrypt('false', process.env.SECRETLOCAL).toString()
                //         res.status(500).send({ success: false, message: err.message,  auth: value})
                //     })
            }else if (serial && serial.dataValues.hardware === null){
                console.log("Writting serial key...")
                let ser = comparison.shift();
                const hrdw = comparison.join('/|')
                const encrypted = crypt.AES.encrypt(hrdw, process.env.SECRETSERVER).toString()
                return Serial.update({
                    serial: ser,
                    uuidOS: comparison[0],
                    uuidHardware: comparison[1],
                    osHostname: comparison[2],
                    diskSize: comparison[3],
                    kernel: comparison[4],
                    systemModel: comparison[5],
                    version: comparison[6],
                    diskSerial: comparison[7],
                    hardware: encrypted
                  }, {
                    where: { serial: ser }
                  })
                    .then(_serial => {
                        result = "Successfully wrote: Serial saved."
                        console.log(result)
                        let value = crypt.AES.encrypt('true', process.env.SECRETLOCAL).toString()
                        res.status(201).send({ success: true, message: 'Serial has been registered successfully.', auth: value })
                    })
                    .catch(err => {
                        result = "Unsuccessfully wrote: Database failled saved."
                        console.log(result)
                        let value = crypt.AES.encrypt('false', process.env.SECRETLOCAL).toString()
                        res.status(500).send({ success: false, message: err.message,  auth: value})
                    })
            }else{
                console.log('Reading serial key...')
                comparison.shift();
                const bytes  = crypt.AES.decrypt(serial.dataValues.hardware, process.env.SECRETSERVER);
                const comp = bytes.toString(crypt.enc.Utf8);
                if(comparison.join('/|') === comp){
                    result = "Successfully read: Serial matched."
                    console.log(result)
                    let value = crypt.AES.encrypt('true', process.env.SECRETLOCAL).toString()
                    res.status(202).send({ success: true, auth: value })
                }else{
                    result = "Unsuccessful read: Serial don't match with the present one."
                    console.log(result)
                    let value = crypt.AES.encrypt('false', process.env.SECRETLOCAL).toString()
                    res.status(401).send({ success: true, auth: value })
                }
            }
        })
        .catch(err => {
            console.log(err)
            let value = crypt.AES.encrypt('false', process.env.SECRETLOCAL).toString()
            res.status(500).send({ success: false, message: err.message, auth: value })
        })
}

exports.create = async (req,res) => {
    const serial = uuidv4()
    const data = req.body
    console.log('Successfull login: Creating new serial key.')
    Serial.create({
        serial: serial,
        owner: data.owner,
        expiry: data.expiry
      })
    res.status(200).json({ success: true, serial: serial})
}

exports.retrieve = async (req,res) => {
    Serial.findAll().then(serials =>{
        res.status(200).json({ success: true, data: serials })
    }).catch(err =>{
        res.status(500).json({ success: false, message: err })
    })
}