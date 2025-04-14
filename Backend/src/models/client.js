const mongoose = require('mongoose');
const User = require('./user');
const Vehicle = require('./vehicle');

const clientSchema = new mongoose.Schema({
    vehicles: [{type: mongoose.Schema.Types.ObjectId, ref: 'vehicles'}],
    isVerified: {type: Boolean, default: false},
    //verificationToken: {type: String}
}); 

//Middleware que remove os veículos quando um cliente é removido
clientSchema.pre('findOneAndDelete', async function (next) {
    try {
        console.log(`Removendo veículos do cliente ${this._id}`);
        await Vehicle.deleteMany({clientID: this._id});
        next();
    }catch(err){
        next(err);
    }
});

module.exports = User.discriminator('Clients', clientSchema);