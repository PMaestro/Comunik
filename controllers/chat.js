const Chat = require('../models/chat');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.createChat = async (req, res, next) => {
    const usersId = req.body.id;
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
        res.send(newChat);
    } else {
        res.send(chat);
    }

}

exports.ListAllChatsTest = async (req, res, next) => {
    const usersId = req.body.id;
    
    const chat = await Chat.findAll({
        include: [{
            model: User,
            where: {
                [Op.and]: [{ id: usersId[0] }/* , { id: usersId[1] } */],
                [Op.and]: [{ id: usersId[1] }/* , { id: usersId[0] } */]
            }
        }]
    })
    if(!chat){
        res.send(chat);
    }else{
        console.log('nenhum chat encontrado.');
        res.send(chat);
    }
}

exports.listUserChat = (req, res, next) => {
    const userId = req.params.id;
    User.findByPk(userId)
        .then(user => {
            console.log(user.name)
            return user.getChats();
        }).then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err);
        });
}

exports.deleteChat = (req, res, next) => {
    
}

exports.updateChat = (req, res, next) => {
    const chatid = req.body.id;
    const chatTitle = req.body.title;
    
    Chat.findByPk(chatid)
    .then(result=>{
        
        if(!result){
            result.title = chatTitle;
            res.send('Chat atualizado!');
        }else{
            res.send('chat não existe!');
        }
    }).catch(err=>{
        console.log(err);
    });
    
}


exports.createChatTest = async (req, res, next) => {
    const usersId = req.body.id;
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
        res.send(newChat);
    } else {
        res.send(chat);
    }
}

exports.ListAllUserChats = (req, res, next) => {
    const userId = req.body.userId;
    User.findByPk(userId)
        .then(result => {
            return result.getChats();
        }).then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err)
        });


}

