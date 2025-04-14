const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

// modelo das reservas
const reserveSchema = new mongoose.Schema({

    clientID: {type: mongoose.Schema.Types.ObjectId, ref: 'Clients'},
    vehicleID: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles'},
    serviceID: [{type: mongoose.Schema.Types.ObjectId, ref: 'Services'}],
    sku: {
        type: String, 
        unique: true, 
        required: true, 
        default: () => uuidv4().split('-')[0] // [a-z0-9]{8}
    },
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    addComents: {type: String, required: false},
    status: {type: String, enum: ["pending", "confirmed", "running", "waiting", "completed", "cancelled"], required: true}

},{
    timestamps: true
});

// Middleware para verificar se existe outra reserva com o mesmo horário
reserveSchema.pre('save', async function (next){
    
    if(!this.isModified('startTime') || !this.isModified('endTime')) return next(); // Se a data não foi alterada, continua normalmente
    
    // Verifica se já existe outra reserva com o mesmo horário (max. 2 reservas simultâneas)
    const overlapping = await mongoose.model('Reserves').countDocuments({
        _id: { $ne: this._id },
        startTime: { $lt: this.endTime },
        endTime: { $gt: this.startTime },
        status: { $ne: 'cancelled' } // Ignora reservas canceladas
    });
    
    if(overlapping >= process.env.MAX_RESERVE_OVERLAP){
        return next(new Error('Horário indisponível: máximo de 2 reservas simultâneas.'));
    }

    next();

});

module.exports = mongoose.model('Reserves', reserveSchema);