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
                const result = "Unsuccessfully read: No serial present."
                console.log(result)
                let value = crypt.AES.encrypt('false', process.env.SECRETLOCAL).toString()
                res.status(401).send({ success: false, message: result,  auth: value})
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
                        const result = "Successfully wrote: Serial saved."
                        console.log(result)
                        let value = crypt.AES.encrypt('true', process.env.SECRETLOCAL).toString()
                        res.status(201).send({ success: true, message: 'Serial has been registered successfully.', auth: value })
                    })
                    .catch(err => {
                        const result = "Unsuccessfully wrote: Database failled saved."
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
                    const result = "Successfully read: Serial matched."
                    console.log(result)
                    let value = crypt.AES.encrypt('true', process.env.SECRETLOCAL).toString()
                    res.status(202).send({ success: true, auth: value })
                }else{
                    const result = "Unsuccessful read: Serial don't match with the present one."
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

    if(data.expiry != 'Unlimited'){
        data.expiry = new Date(data.expiry)
        data.expiry = data.expiry.setHours(data.expiry.getHours() + 1);
        data.expiry = new Date(data.expiry).toString()
        // data.expiry = data.expiry.getDate()+'-'+(data.expiry.getMonth()+1)+'-'+data.expiry.getFullYear();
    }
    console.log('Successfull login: Creating new serial key.')
    await Serial.create({
        serial: serial,
        owner: data.owner,
        expiracy: data.expiry
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

exports.retrieveOne = async (req,res) => {
    const data = req.body
    Serial.findOne({
        where: { serial: data.srl }
    }).then(serials =>{
        res.status(200).json({ success: true, data: serials })
    }).catch(err =>{
        res.status(500).json({ success: false, message: err })
    })
}

exports.del = async(req, res) => {
    const data = req.params.id
    await delSite(data)
    res.status(200).json({success: true});
}

exports.update = async(req, res) => {
    const data = req.body
    console.log(data)
    try{
        await updateDb(data)
        res.status(200).json({success: true});
    }catch(err){

        res.status(500).json({success: false, mess: err})
    }
}

const delSite = async function(id){
    return Serial.destroy({
      where: { serial: id }
    })
}

async function updateDb(body) {
    const srl = await Serial.findOne({
        where: { serial: body.id },
    })
    await srl.update({owner: body.owner, expiracy: body.expiry})
    return srl
}