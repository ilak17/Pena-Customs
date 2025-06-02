const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const ServiceCategory = [
  'Mecânica Geral',
  'Mecânica Avançada',
  'Elétrica e Eletrónica',
  'Manutenção Rápida',
  'Rodas e Travões',
  'Limpeza e Estética',
  'Climatização e Conforto',
  'Chapa e Pintura',
  'Personalização',
  'Diagnóstico e Inspeção',
  'Outro'
];

//modelo do serviço
const serviceSchema = new mongoose.Schema({

    sku: { // Gera automaticamente um SKU único para cada Serviço criado
        type: String, 
        unique: true, 
        required: true, 
        default: () => uuidv4().split('-')[1] // [a-z0-9]{4}
    },
    category: [{type: String, enum: ServiceCategory, required: true, default: 'Outro'}],
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    estimatedTime: {type: String, required: false, 
        match: /^(\d+d)?(?:-(\d+h))?(?:-(\d+m))?$|^(\d+h)?(?:-(\d+m))?$|^(\d+m)$/
    },
    status: {type: String, enum: ["available", "unavailable"], required: true},
    image: {
        type: String,
        default: null,
        required: false,
    }
});

module.exports = mongoose.model('Services', serviceSchema);