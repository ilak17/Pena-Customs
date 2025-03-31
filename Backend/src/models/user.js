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
    
    if(!this.isModified('password')) return next();

    try{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }catch(err){
        console.log('Erro ao criptografar a senha');
        next(err);
    }
    
});

module.exports = mongoose.model('Users', userSchema);