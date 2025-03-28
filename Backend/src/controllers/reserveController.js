const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');
const Service = require('../models/service');

exports.createReserve = async (req, res) => {
    try{

        const clientID = req.params.id;
        const {serviceID, plate, date, time} = req.body;

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

        const service = await Service.findById(serviceID);
        if(!service){
            return res.status(404).json({sucess:false, message: "Serviço não encontrado"});
        }

        const reserve = new Reserve({ 
            clientID: client._id,
            vehicleID: vehicle._id,
            serviceID: service._id,
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

exports.getAllReserves = async (req, res) => {
    try{
        const reserves = await Reserve.find();
        res.status(200).json({sucess: true, reserves: reserves});
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}