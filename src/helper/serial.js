const si = require('systeminformation')
const bcrypt = require('bcryptjs')
const fs = require('fs')

exports.process = async() => {
    return new Promise((resolve,reject) => {
        si.getStaticData()
            .then(async data => {
                const file = './.key.scrt'
                let result
                let phrase = `${data.uuid.os}-${data.uuid.hardware}-${data.os.hostname}-${data.diskLayout[0].size}-${data.versions.kernel}-${data.system.model}-${data.version}-${data.diskLayout[0].serialNum}`
                phrase = phrase.split(' ').join('_')
            
                if (!fs.existsSync(file)) {
                    console.log("Writting serial key...")
                    const salt = bcrypt.genSaltSync(16);
                    const encrypted = bcrypt.hashSync(phrase, salt)
            
                    fs.writeFile(file,encrypted, 'utf8', async(err) => {
                    if (err) throw err;
                    fs.chmod(file, 0o400, async() => {
                        result = "Successfully wrote: Serial saved."
                        console.log(result)
                        resolve(true)
                    })
                    })
                }else{
                    console.log('Reading serial key...')
                    try {
                    const data = await fs.readFileSync(file, 'utf8')
                    const serialVerification = bcrypt.compareSync(phrase, data)
            
                    if(!serialVerification){
                        result = "Unsuccessful read: Serial don't match."
                        console.log(result)
                        reject(false)
                    }else{
                        result = "Successful read: Serial matched."
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