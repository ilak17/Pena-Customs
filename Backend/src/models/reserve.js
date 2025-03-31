const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({

    clientID: {type: mongoose.Schema.Types.ObjectId, ref: 'Clients'},
    vehicleID: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles'},
    serviceID: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
    dateTime: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], required: true}

});

reserveSchema.pre('save', async function (next){
    const oneHourBefore = new Date(this.dateTime);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);

    const oneHourAfter = new Date(this.dateTime);
    oneHourAfter.setHours(oneHourAfter.getHours() + 1);

    // Verifica se existe qualquer reserva dentro do intervalo de 1 hora
    const existingReservation = await mongoose.model('Reserves').findOne({
        dateTime: { $gt: oneHourBefore, $lt: oneHourAfter }
    });

    if (existingReservation) return next(new Error('Já existe uma reserva dentro do intervalo de 1 hora.'));

    next();
});

reserveSchema.pre('updateOne', async function (next){

    const update = this.getUpdate(); // Recebe os dados que estão sendo atualizados
    
    if (!update.dateTime) return next(); // Se a data não foi alterada, continua normalmente

    const oneHourBefore = new Date(update.dateTime);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);

    const oneHourAfter = new Date(update.dateTime);
    oneHourAfter.setHours(oneHourAfter.getHours() + 1);

    const existingReservation = await mongoose.model('Reserves').findOne({
        _id: { $ne: this.getQuery()._id }, // Ignora a reserva que está sendo atualizada
        dateTime: { $gt: oneHourBefore, $lt: oneHourAfter }
    });

    if (existingReservation) return next(new Error('Já existe uma reserva dentro do intervalo de 1 hora.'));

    next();
});

module.exports = mongoose.model('Reserves', reserveSchema);