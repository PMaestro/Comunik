const Message = require('../models/messages');
const Chat = require('../models/chat');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//basic implementation will recive a rework and improviments soon.

//we already will have the user id and the chat id so the resquest must have userId chatID and textMessage
exports.createMessage =  (req, res, next) => {
    const userId = req.body.userId;
    const chatId = req.body.chatId;
    let textMessage = req.body.message;
    let msg = null;

    Message.create({ text: textMessage })
    .then(result=>{
        msg = result;
       return User.findByPk(userId);
    })
    .then((user)=>{
        user.addMessage(msg);
       return Chat.findByPk(chatId)
      
    }).then(chat=>{
        chat.addMessage(msg);
        res.send(msg);
    })
    .catch(err=>{
        console.log(err);
    })
    /* try {
        const messageCreated = await Message.create({ text: textMessage });
        const sender = await User.findByPk(userId);
        await sender.addMessage(messageCreated);
        const chat = await Chat.findByPk(chatId);
        await chat.addMessage(messageCreated);

    } catch (error) {
    console.log(error); 
    } */
}

exports.listChatMessages =  (req, res, next) => {
   const chatId = req.body.chatId;
    Chat.findByPk(chatId)
    .then(chatFetched =>{
        return chatFetched.getMessages();
    })
    .then(result=>{
        res.json(result);
    })
    .catch(err=>{
        console.log(err);
    });

}