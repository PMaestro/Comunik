const Chat = require('../models/chat');
const User = require('../models/user');


exports.createChat = (req, res, next) => {

    const chatMembersData = req.body.chatMembers;
    console.log('Metodo criar chat foi chamado');
    const userId = req.body.id;
    let userArray = null;

    User.findAll({
        where: {
            id: userId
        }
    })
        .then(result => {
            userArray = result;
            console.log(result[0].name);
            console.log(result[0]);
            let titleConcat = result[0].name + ' and ' + result[1].name;
            return Chat.create({ title: titleConcat });
        }).then(chatCreated =>{
            chatCreated.addUsers(userArray);
            res.send("Chat criado");
        })
        .catch(err=>{
            console.log(err);
        });

    /* Chat.findOrCreate({
        include: [{
            model: User,
            where: { id: userId, 
                title: 'New Chat' },
        }],
    
    })
        .then((chat, created) => {
            if (!created) {
                console.log('Chat já existe');
                res.json(chat);
            } else {
                //chat.addUsers(user);
                console.log("chat criado");
                res.json(chat)
            }
        })
        .catch(err => {
            console.log(err);
        }); */




    /*  console.log(Object.keys(result.__proto__)); */
    // Chat.setParents()

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

}

exports.ListAllChats = (req, res, next) => {
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

