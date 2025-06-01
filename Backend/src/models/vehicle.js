const mongoose = require('mongoose');
//const Client = require("./client");

//modelo do veículo
const vehicleSchema = mongoose.Schema({

    clientID: {type: mongoose.Schema.Types.ObjectId, ref: 'Clients'},
    plate: {type: String, required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    image: {
        type: String,
        default: null
    }
});

//Middleware para verificar se existe Veículos com a mesma matrícula 
vehicleSchema.pre('save', async function (next){
    try {

        if (!this.isModified('plate')) return next();

        const existingVehicle = await mongoose.model('Vehicles').findOne({plate: this.plate});

        if(existingVehicle) return next(new Error('Já existe um veículo com esta matrícula'));

        next();

    } catch (err) {
        console.log('Erro ao verificar email ou criptografar senha:', err);
        next(err);
    }
});

// Middleware para remover o veículo da lista de veículos do cliente
vehicleSchema.pre('deleteOne', {document: true, query: false}, async function (next) {
    try{
        const Client = require("./client");
        await Client.findByIdAndUpdate({_id: this.clientID}, {$pull: {vehicles: this._id}});
        next();
    }catch(err){
        next(err);
    }
});

module.exports = mongoose.model('Vehicles', vehicleSchema);