const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKey || 'secretPassword';
const Reminder = require('../models/reminder');
const { validationResult } = require('express-validator');

/* list all methods created by sequelize
 console.log(Object.keys(result.__proto__)); */

exports.signup = (req, res, next) => {
  
  /*   const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Usuario já existe!');
        error.statusCode = 422;
        throw error;
    }
 */
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const status = req.body.status;

    User.findOne({
        where: {
            email: email
        }
    })
        .then(result => {
            if (!result) {
                const hashPass = bcrypt.hashSync(password, 12);
                User.create({
                    name: name,
                    email: email,
                    password: hashPass,
                    status: status
                })
                    .then(result => {
                        console.log("Usuario Cadastrado!");
                        res.status(201).send('Cadastrado');
                    })
                    .catch(err => {
                        console.log("erro ao tentar cadastrar no banco de dados!\n" + err);
                    });

            } else {

                console.log(req.body.email + " email já cadastrado!");
                res.send('email ja cadastrado!');

            }
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode= 500;
            }
            console.log(err);
            next(err);
        });
};


exports.login = (req, res, next) => {
    const password = req.body.password;
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(result => {
            if (bcrypt.compareSync(password, result.password)) {
                let token = jwt.sign(result.dataValues, secretKey, { expiresIn: '1h' });
                result.status = "online"
                //res.status(200).send('usuario fez o login!')
                return (result.save(), token);
            } else {
                res.status(422).send("Usuario nao existe!");
            }
        }).then((userSavedResult, token) => {
            res.status(200).json({ token: token });
        })
        .catch(err => {
            res.send(`send error ${err}`);
        })
}

exports.logout = (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], secretKey);

    User.findOne({
        where: {
            id: decoded.id
        }
    }).then(result => {
        result.status = 'offline';

    })
        .catch(err => {
            console.log(err);
        });
}

exports.listOnline = (req, res, next) => {
    User.findAll({
        attributes: ['id', 'name', 'email', 'status'],
        where:
        {
            status: "online"
        }
    })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err)
        });
}


exports.listUsers = (req, res, next) => {
    User.findAll({ attributes: ['id', 'name', 'email', 'status'] })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err)
        });

}

exports.listUserTest = (req, res, next) => {
    User.findAll({
        attributes: ['id', 'name', 'email', 'status'],
        where: {
            id: [1, 2]
        }
    }).then(result => {
        res.json(result);

    })
        .catch(err => {
            console.log(err);
        });

}



exports.createReminder = (req, res, next) => {
    // receiver: req.body.reciverId,
    const reminderData = {
        sender: req.body.senderId,
        text: req.body.text,
        timer: req.body.timer
    }

    User.findByPk(req.body.reciverId)
        .then(result => {
            console.log(result.name);

            return result.createReminder(reminderData)
        }).then(result => {
            res.send('reminder criado!');
        })
        .catch(err => {

        });
}