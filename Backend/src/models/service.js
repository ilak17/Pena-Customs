const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

//modelo do serviço
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
    estimatedTime: {type: String, required: false, 
        match: /^(\d+d)?(?:-(\d+h))?(?:-(\d+m))?$|^(\d+h)?(?:-(\d+m))?$|^(\d+m)$/
    },
    status: {type: String, enum: ["available", "unavailable"], required: true}

});

module.exports = mongoose.model('Services', serviceSchema);