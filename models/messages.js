const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Messages = sequelize.define('messages',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        
    },
    sender:{
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Messages;