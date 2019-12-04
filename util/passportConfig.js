const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt =  require('bcryptjs');    

module.exports = function( passport){

    passport.use(  new localStrategy({usernameField: 'email'}, (email,password,done)=>{
        User.findOne({
            where: {
                email: email
            }
        })
        .then(result=>{
            if(!result){
                return done(null,false,{message:'Não existe usuario com esse email!'});
            }else{
                if (bcrypt.compareSync(password, result.password)) {
                   /*  result.status = "online"
                   return (result.save(),done(null,)); */
                   return done(null,user, {message:"Usuario logado!"});
                }else{
                    return done(null, false, {message: 'Senha incorreta!'});
                }
            }
        })
        .catch(err =>{
            console.log(err);   
        });
    }));

    //passar dados do usuario para uma sessao
    passport.serializeUser((user,done)=>{
        done(null, user.id)
    });

    passport.deserializerUser((id,done)=>{
        User.findByPk(id, (err,user)=>{
            done(err,user)
        })
    })
}