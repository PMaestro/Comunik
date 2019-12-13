const Reminder = require('../models/reminder');
const User = require('../models/user');

exports.create = (req, res, next) => {
    const reminderData = {
        sender: req.body.senderId,
        receiver: req.body.reciverId,
        text: req.body.text,
        timer: req.body.timer
    }
   
    Reminder.create(reminderData)
        .then(result => {
            console.log('reminder criado!');
            res.status(201).json({ message: 'Reminder criado:', reminder: result.dataValues });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.findReminders = (req, res, next) => {
    Reminder.findAll({
        where: {
            receiver: req.body.reciverId
        }
    })
        .then(result => {
            res.status(200).json({ message: 'Reminder Encontrado:', reminder: result.dataValues });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.listAll = (req, res, next) => {
    Reminder.findAll()
        .then(result => {
            res.status(200).json({ message: 'Reminders Encontrados:', reminder: result.dataValues });
        })
        .catch(err => {
            console.log(err);
        });
}


//expects reminderId text and timer to update
exports.update = (req, res, next) => {
    const text = req.body.text;
    const timer = req.body.timer;

    Reminder.findByPk(req.body.reminderId)
        .then(result => {
            result.text = text;
            result.timer = timer;
            return result.save();
        })
        .then(result => {
            res.status(203).json({ message: 'Reminder atualizado:', reminder: result.dataValues });
        })
        .catch(err => {
            console.log(err);
        });
}

//expects reminderId
exports.delete = (req, res, next) => {

    Reminder.destroy({
        where: {
            id: req.body.reminderId
        }
    }, { force: true })
    .then(result => {
        res.status(200).json({ message: 'Reminders deletado!'});
    })
    .catch(err=>{
        console.log(err);
    });


}

exports.getOneReminder = (req, res, next) => {

}
    
/* exports.testEagerLoad = (req, res, next) =>{
    const userId = req.body.id;
    
    Reminder.findAll({
        include: [{
            model: User,
            where: { id: userId }
        }]
    })
    .then(result => {
        console.log({title: (result.name[0]+' and '+result.name[1])});
        for(user in result){
            console.log('\n\nUsuario: \n')
        console.log(JSON.stringify(result));
        }
        res.json(result);
       
    })
    .catch(err=>{
        console.log(err);
    });
} */