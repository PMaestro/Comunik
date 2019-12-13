const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        
    },
    name: Sequelize.STRING,
    email: { 
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },unique: {
            args: true,
            msg: 'Email address already in use!'
        }
    },
    password: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['offline', 'online', 'busy','away']
    }
});

module.exports = User;
