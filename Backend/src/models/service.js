const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    status: {type: String, enum: ["available", "unavailable"], required: true}

});

module.exports = mongoose.model('Services', serviceSchema);