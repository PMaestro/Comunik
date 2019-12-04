const express = require('express');
const userController = require('../controllers/user');
const ReminderController = require('../controllers/reminder');
const ChatController = require('../controllers/chat');

const routes = express.Router();

//user methods
routes.post('/signup', userController.signup);

routes.post('/login', userController.login);

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

routes.get('/listAllchats', ChatController.ListAllChats);

routes.put('/createChat', ChatController.createChat);

routes.get('/listUserChat/:id', ChatController.listUserChat); 



module.exports = routes;