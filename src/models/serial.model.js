module.exports = (sequelize, Sequelize) => {
    const Serial = sequelize.define('serial', {
      serial: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      hardware: {
        type: Sequelize.STRING(1000)
      },   
      uuidOS: {
        type: Sequelize.STRING
      },      
      uuidHardware: {
        type: Sequelize.STRING
      },
      osHostname: {
        type: Sequelize.STRING
      },
      kernel: {
        type: Sequelize.STRING
      },
      systemModel: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      expiracy: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      }
    })
  
    return Serial
  }