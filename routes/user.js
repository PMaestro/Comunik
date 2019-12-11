const express = require('express');
const userController = require('../controllers/user');
const ReminderController = require('../controllers/reminder');
const ChatController = require('../controllers/chat');
const { body } = require('express-validator');

const routes = express.Router();

//user methods
routes.post('/signup', userController.signup)
routes.post('/login', [
    body('name').not().isEmpty(),
    body('email')
        .isEmail()
        .normalizeEmail(),
    body('password').isLength({ min: 6 })
], userController.login);

routes.get('/online', userController.listOnline);

routes.get('/listAll', userController.listUsers);

routes.post('/remindercreate', userController.createReminder);

routes.put('/Test', userController.listUserTest)

//reminder methods
routes.post('/reminder/create', ReminderController.create);

routes.get('/reminder/listAll', ReminderController.listAll);

routes.post('/reminder/update', ReminderController.update);

routes.post('/reminder/delete', ReminderController.delete);

routes.get('/testeLoad', ReminderController.testEagerLoad);

//chats methods

routes.get('/listAllUserchats', ChatController.ListAllUserChats);

routes.put('/createChat', ChatController.createChat);

routes.get('/listUserChat/:id', ChatController.listUserChat);

routes.post('/updateChat', ChatController.updateChat);

routes.get('/ListAllChatsTest', ChatController.ListAllChatsTest);

routes.post('/createChatsTest', ChatController.createChatTest);



module.exports = routes;