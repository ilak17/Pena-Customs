const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');

exports.createReserve = async (req, res) => {
    try{

        const clientID = req.params.id;
        const {plate, date, time} = req.body;
        console.log(clientID, plate, date, time);

        // Validações básicas
        if (!clientID || !plate || !date || !time) {
            return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
        }
        
        const client = await Client.findById(clientID);
        if(!client){
            return res.status(404).json({sucess:false, message: "Cliente não encontrado"});
        }

        const vehicle = await Vehicle.findOne({clientID: clientID, plate: plate});
        if(!vehicle){
            return res.status(404).json({sucess:false, message: "Veículo não encontrado"});
        }

        const reserve = new Reserve({ 
            clientID: client._id,
            vehicleID: vehicle._id,
            date,
            time,
            status: "pending"
        });
        
        await reserve.save();

        res.status(201).json({
            sucess: true,
            message: "Reserva guardada com sucesso",
            reserve: reserve
        });

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}