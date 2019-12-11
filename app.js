const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 1337;
const userRoutes = require('./routes/user');
const sequelize = require('./util/database');
const passport =  require('passport');
const session = require('express-session');
//initialize app.
const app = express();

//passport config
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

//importando models
const Users = require('./models/user');
const Reminders = require('./models/reminder');
const Chat = require ('./models/chat');
const Messages = require('./models/messages');


//Express middleware prevent attack
app.disable('x-powered-by');

//json
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Rotas
app.get('/', function(req, res) {
 
  res.send('Passport initialized');

});

app.use('/user', userRoutes);

//assossiations
/* Users.hasMany(Reminders,{foreignKey: 'receiver', sourceKey: 'id'});
//many-to-many onde um usuario tem varios chats e um chat tem varios usuarios
Users.belongsToMany(Chat, { through: ChatMembers });
Chat.belongsToMany(Users, { through: ChatMembers });
//one-to-many onde um chat tem varias mensagens mas uma msg está apenas em um chat.
Chat.hasMany(Messages);
 */

Users.hasMany(Reminders,{onDelete: 'CASCADE',foreignKey: 'receiver', sourceKey: 'id'})
Users.belongsToMany(Chat, {onDelete: 'CASCADE', through: 'ChatMembers'})
Users.hasMany(Messages, {onDelete: 'CASCADE'})

Reminders.belongsTo(Users, { onDelete: 'CASCADE', foreignKey: 'receiver',  sourceKey: 'id'});

Messages.belongsTo(Chat,{onDelete:'CASCADE'})
Messages.belongsTo(Users,{onDelete:'CASCADE'})

Chat.belongsToMany(Users, {onDelete: 'CASCADE', through: 'ChatMembers'})
Chat.hasMany(Messages,{onDelete: 'CASCADE'})

//iniciando a conexao com o banco e o servidor
sequelize
 // .authenticate()
  .sync({ force: true })
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(PORT);
    Users.bulkCreate([
      {name:'eric',email:'test1@hotmail.com',password:'123456',status:'offline'},
      {name:'joao',email:'test2@hotmail.com',password:'123456',status:'offline'},
      {name:'maria',email:'test3@hotmail.com',password:'123456',status:'offline'}
    ]);
   
  }).then(()=>{
    console.log('Usuarios criados');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });