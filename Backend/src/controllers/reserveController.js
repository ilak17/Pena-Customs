const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');
const Service = require('../models/service');

exports.createReserve = async (req, res) => {
    try{

        const clientID = req.params.id;
        const {serviceID, plate, dateTime} = req.body;

        // Validações básicas
        if (!clientID || !serviceID || !plate || !dateTime) {
            return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
        }
        
        const client = await Client.findById(clientID);
        if(!client) return res.status(404).json({sucess:false, message: "Cliente não encontrado"});

        const vehicle = await Vehicle.findOne({clientID: clientID, plate: plate});
        if(!vehicle) return res.status(404).json({sucess:false, message: "Veículo não encontrado"});
        

        const service = await Service.findById(serviceID);
        if(!service) return res.status(404).json({sucess:false, message: "Serviço não encontrado"});
        

        const reserve = new Reserve({ 
            clientID: client._id,
            vehicleID: vehicle._id,
            serviceID: service._id,
            dateTime,
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

exports.getReserveById = async (req, res) => {
    try{
        const reserveID = req.params;
        const reserve = await Reserve.findById(reserveID);

        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"});

        res.status(200).json({sucess: true, reserves: reserve});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.updateReserve = async (req, res) => {
    try{
        console.log("AQUIiiiii\n");

        const reserveID = req.params.id;
        const {dateTime, status} = req.body;

        const reserve = await Reserve.findById(reserveID);
        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"}); 
        
        reserve.dateTime = dateTime || reserve.dateTime;
        reserve.status = status || reserve.status;

        await reserve.updateOne({
            dateTime: reserve.dateTime,
            status: reserve.status
        });

        res.status(200).json({sucess: true, message: "Reserva atualizada com sucesso", reserve: reserve});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.daleteReserve= async (req, res) => {
    try{
        const reserve = await Reserve.findById(req.params.id);
        if(!reserve) return res.status(404).json({ sucess: false, message: "Reserva não encontrada" });
            
        await Reserve.findByIdAndDelete(reserve._id);
            
        res.status(200).json({ sucess: true, message: "Reserva removida com sucesso" });
    
    }catch(err){
            console.log(err);
            res.status(500).json({ sucess: false, message: "Erro interno do servidor" });
    }
}