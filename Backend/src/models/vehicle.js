const mongoose = require('mongoose');
//const Client = require("./client");

const vehicleSchema = mongoose.Schema({

    clientID: {type: mongoose.Schema.Types.ObjectId, ref: 'Clients'},
    plate: {type: String, required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true}    

});

// Middleware para remover o veículo da lista de veículos do cliente
vehicleSchema.pre('deleteOne', {document: true, query: false}, async function (next) {
    try{
        const Client = require("./client");
        console.log(`Removendo referência do veículo ${this._id} do cliente ${this.clientID}`);
        await Client.findByIdAndUpdate({_id: this.clientID}, {$pull: {vehicles: this._id}});
        next();
    }catch(err){
        next(err);
    }
});

module.exports = mongoose.model('Vehicles', vehicleSchema);