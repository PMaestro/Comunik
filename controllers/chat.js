const Chat = require('../models/chat');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.createChat = async (req, res, next) => {
    const usersId = req.body.id;
    try {
        const chat = await Chat.findAll({
            include: [{
                model: User,
                where: {
                    [Op.and]: [{ id: usersId[0] }/* , { id: usersId[1] } */],
                    [Op.and]: [{ id: usersId[1] }/* , { id: usersId[1] } */]
                }
            }]
        })
        if (chat.length == 0) {
            const newChat = await Chat.create({ title: 'test' });
            await newChat.addUsers(usersId);
            res.status(201).json({ message: 'Chat criado:', chat: newChat.dataValues });
        } else {
            res.status(200).json({ message: 'Chat encontrado:', chat: chat.dataValues  });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);

    }

}

exports.ListAllChats = async (req, res, next) => {
    const usersId = req.body.id;

    try {
        const chat = await Chat.findAll({
            include: [{
                model: User,
                where: {
                    [Op.and]: [{ id: usersId[0] }/* , { id: usersId[1] } */],
                    [Op.and]: [{ id: usersId[1] }/* , { id: usersId[0] } */]
                }
            }]
        })
        if (!chat) {
            res.status(200).json({ message: 'Chat encontrado:', chat: chat.dataValues });
        } else {
            console.log('nenhum chat encontrado.');
            res.status(422).json({ message: 'Nenhum chat encontrado:', chat: newChat.dataValues });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
    }
}

exports.listUserChat = (req, res, next) => {
    const userId = req.params.id;
    User.findByPk(userId)
        .then(user => {
            console.log(user.name)
            return user.getChats();
        }).then(result => {
            res.status(200).json({ message: 'Chats encontrados:', chat: result.dataValues });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log(err);
            next(err);
        });
}

exports.deleteChat = (req, res, next) => {

}

exports.updateChat = (req, res, next) => {
    const chatid = req.body.id;
    const chatTitle = req.body.title;

    Chat.findByPk(chatid)
        .then(result => {
            if (!result) {
                result.title = chatTitle;
                return Chat.save(result);
            } else {
                res.status(422).json({ message: 'Chat  Não encontrado!' });
            }
        })
        .then(result => {
            res.status(200).json({ message: 'Chat  Atualizado:', chat: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            console.log(error);
            next(error);
        });

}

exports.ListAllUserChats = (req, res, next) => {
    const userId = req.body.userId;
    User.findByPk(userId)
        .then(result => {
            return result.getChats();
        }).then(result => {
            res.status(200).json({ message: 'Chats encontrados:', chat: result.dataValues });;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log(err);
            next(err);
        });
}

