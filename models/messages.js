const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Messages = sequelize.define('messages',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    active:{
        type:Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Messages;