const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const serviceSchema = new mongoose.Schema({

    sku: { // Gera automaticamente um SKU único para cada Serviço criado
        type: String, 
        unique: true, 
        required: true, 
        default: () => uuidv4().split('-')[1] // [a-z0-9]{4}
    },
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    estimatedTime: {type: String, required: true},
    status: {type: String, enum: ["available", "unavailable"], required: true}

});

module.exports = mongoose.model('Services', serviceSchema);