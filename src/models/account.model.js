module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define('accounts', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
          },
          username: {
            type: Sequelize.STRING
          },
          password: {
            type: Sequelize.STRING
          },
          disabled: {
            type: Sequelize.INTEGER
          }
    })
  
    return Account
  }