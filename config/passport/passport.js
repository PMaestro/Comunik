const localStrategy = require('passport-local').Strategy;
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports = async (passport) =>{
    passport.use(new localStrategy({ usernameField: 'email' },async (email, password, done) => {
    
       try {
        const user =  await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            console.log("nenhum usuario encontrado com esse email!");
            done(null, false, { message: 'Não existe usuario com esse email!' });
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                user.status = "online"
                console.log(user,"Usuario encontrado atualizando estatus do usuario para online!");
              const usuarioOnline =  await user.save();
              if(usuarioOnline)
                done(null, user, { message: "Usuario logado!" });
                
            } else {
                console.log("Password incorreto!");
                done(null, false, { message: 'Senha incorreta!' })
            }
        }
       } catch (error) {
        if(!error.statusCode){
            error.statusCode= 500;
        }
        console.log(error);
        next(error);
       }

    }));

    //passar dados do usuario para uma sessao
    passport.serializeUser((user, done) => {
        console.log('metodo serializeUser chamado!')
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ // Using sequelize model functoin
            where: {
                'id': id
            }
        }).then(user => {
            if (user == null) {
                done(new Error('Wrong user id.'))
            }

            done(null, user) // Standerd deserailize callback
        })
    });
}