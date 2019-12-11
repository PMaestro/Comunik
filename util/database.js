const Sequelize = require('sequelize');

const sequelize = new Sequelize('treino', 'root', '1234', {
    dialect: 'mysql',
    host: 'localhost',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

module.exports = sequelize;