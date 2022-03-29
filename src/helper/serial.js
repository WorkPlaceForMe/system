const si = require('systeminformation')
const fs = require('fs')
require('dotenv').config({ path: '.env' })
const crypt = require('crypto-js')

exports.process = async() => {
    return new Promise((resolve,reject) => {

        if(!process.env.SERIAL){
            console.log("Unsuccessful: Serial not pressent, please insert Serial Key.")
            reject(false)
        }
        si.getStaticData()
            .then(async data => {
                const file = './.key.scrt'
                let result
                let phrase = `${process.env.SERIAL}/|${data.uuid.os}/|${data.uuid.hardware}/|${data.os.hostname}/|${data.diskLayout[0].size}/|${data.versions.kernel}/|${data.system.model}/|${data.version}/|${data.diskLayout[0].serialNum}`

                if (!fs.existsSync(file)) {
                    console.log("Writting serial key...")
                    const encrypted = crypt.AES.encrypt(phrase, process.env.SECRETSERVER).toString()
            
                    fs.writeFile(file, encrypted, 'utf8', async(err) => {
                        if (err) throw err;
                        fs.chmod(file, 0o400, async() => {
                            result = "Successfully wrote: Serial saved."
                            console.log(result)
                            resolve(true)
                        })
                    })
                } else{
                    console.log('Reading serial key...')
                    try {
                        const data = await fs.readFileSync(file, 'utf8')
                        const bytes  = crypt.AES.decrypt(data, process.env.SECRETSERVER);
                        const comparison = bytes.toString(crypt.enc.Utf8);
                
                        if (phrase !== comparison){
                            result = "Unsuccessful read: Serial don't match with the present one."
                            console.log(result)
                            reject(false)
                        } else{
                            result = "Successfully read: Serial matched."
                            console.log(result)
                            resolve(true)
                        }
                    } catch (err) {
                        console.error(err)
                        reject(false)
                    }
                }
            })
            .catch(error => {
                console.error(error)
                reject(error)
            })
    })
}