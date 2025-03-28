const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({

    clientID: {type: mongoose.Schema.Types.ObjectId, ref: 'Clients'},
    vehicleID: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles'},
    serviceID: {type: mongoose.Schema.Types.ObjectId, ref: 'Services'},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], required: true}

});

module.exports = mongoose.model('Reserves', reserveSchema);