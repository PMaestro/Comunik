const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const appRoutes = require('./routes/routes');
const sequelize = require('./util/database');
const passport = require('passport');
var cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('connect-flash');
const PORT = process.env.PORT || 1337;
const SESSION_SECRET = process.env.SESSION_SECRET || 'arnold schwarzenegger';
//initialize app.
const app = express();

//importando models
const Users = require('./models/user');
const Reminders = require('./models/reminder');
const Chat = require('./models/chat');
const Messages = require('./models/messages');


//Express middleware prevent attack
app.disable('x-powered-by');
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//Rotas
app.get('/', function (req, res) {
  res.send('Passport initialized');
});
app.use('/user', appRoutes);

//error handling
app.use((error,req,res,next)=>{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({message: message});
});

//passport config
app.use(session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true })); // session secret
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require(path.join(__dirname, 'config','passport','passport.js'))(passport); 


//sequelize Associations
Users.hasMany(Reminders, { onDelete: 'CASCADE', foreignKey: 'receiver', sourceKey: 'id' })
Users.belongsToMany(Chat, { onDelete: 'CASCADE', through: 'ChatMembers' })
Users.hasMany(Messages, { onDelete: 'CASCADE',foreignKey: 'sender', sourceKey: 'id' })

Reminders.belongsTo(Users, { onDelete: 'CASCADE', foreignKey: 'receiver', sourceKey: 'id' });

Messages.belongsTo(Chat, { onDelete: 'CASCADE' })
Messages.belongsTo(Users, { onDelete: 'CASCADE', foreignKey: 'sender', sourceKey: 'id' })

Chat.belongsToMany(Users, { onDelete: 'CASCADE', through: 'ChatMembers' })
Chat.hasMany(Messages, { onDelete: 'CASCADE' })

//iniciando a conexao com o banco e o servidor
sequelize
  // .authenticate()
  .sync(/* { force: true } */)
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(PORT);
    /* Users.bulkCreate([
      {name:'eric',email:'test1@hotmail.com',password:'123456',status:'offline'},
      {name:'joao',email:'test2@hotmail.com',password:'123456',status:'offline'},
      {name:'maria',email:'test3@hotmail.com',password:'123456',status:'offline'}
    ]); */

  }).then(() => {
    console.log('Usuarios criados');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });