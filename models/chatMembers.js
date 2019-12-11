const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ChatMembers = sequelize.define('chatMembers',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        
    }
});

module.exports =ChatMembers;