const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {type: String, required: true},
    phone: {type: Number},
    email: {type: String, required: true, unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },
    password: {type: String, required: true},
    //role: {type: String, enum: ["admin", "client"], required: true}

});

userSchema.pre('save', async function (next){

    if (!this.isModified('password') && !this.isModified('email')) return next();

    try {
        
        if(this.isModified('email')){
            const existingUser = await mongoose.model('Users').findOne({ email: this.email });

            if(existingUser){
                return next(new Error('Já existe uma conta com este email.'));
            }
        }
        
        // Se a senha foi modificada, criptografa antes de salvar
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }

        next();
    } catch (err) {
        console.log('Erro ao verificar email ou criptografar senha:', err);
        next(err);
    }
});

/* TOIMP in case
userSchema.pre('updateOne', async function (next){

    const update = this.getUpdate(); // Recebe os valores que estão a ser atulizados
    
    if(!update.email) return next(); // Caso o email não tenha sido alterado, continua normalmente

    // Verifica se já existe outro usuário com o mesmo email
    const existingUser = await mongoose.model('Users').findOne({ email: update.email });

    if (existingUser) {
        return next(new Error('Já existe uma conta com este email'));
    }

    next();

}); */

module.exports = mongoose.model('Users', userSchema);