const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');
const Service = require('../models/service');
const reserveUtil = require('../utils/reserveUtil');

exports.getAllReserves = async (req, res) => {
    try{

        const {s, sortBy = 'startTime', order = 'asc'} = req.query;
        
        let query = {};
        if(s){
            query = {
                $or: [
                    { sku: new RegExp(s, 'i') },
                    { clientID: new RegExp(s, 'i') },
                    { vehicleID: new RegExp(s, 'i') },
                    { serviceID: new RegExp(s, 'i') },
                    { status: new RegExp(s, 'i') }
                ]
            };
        }

        const sortOrder = order === 'desc' ? -1 : 1;

        const reserves = await Reserve.find(query).sort({ [sortBy]: sortOrder }).populate('clientID').populate('vehicleID').populate('serviceID');
        if(!reserves) return res.status(404).json({sucess: false, message: "Reservas não encontradas"});

        res.status(200).json({sucess: true, message: reserves});
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.getReserveBySKU = async (req, res) => {
    try{
        const sku = req.params.sku;
        const reserve = await Reserve.findOne({
            $or: [
                { clientID: req.user._id },
                { __t: "Admins" }
            ],
            sku: sku
        });

        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"});

        res.status(200).json({sucess: true, reserves: reserve});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.getMyReserves = async (req, res) => {
    try{
        const client = req.user;

        const {s, sortBy = 'startTime', order = 'asc'} = req.query;

        let query = {clientID: client._id};
        if(s){
            query = {
                $or: [
                    { sku: new RegExp(s, 'i') },
                    { vehicleID: new RegExp(s, 'i') },
                    { serviceID: new RegExp(s, 'i') },
                    { status: new RegExp(s, 'i') }
                ]
            };
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const reserves = await Reserve.find(query).sort({ [sortBy]: sortOrder }).populate('clientID').populate('vehicleID').populate('serviceID');
        if(!reserves) return res.status(404).json({sucess: false, message: "Reservas não encontradas"});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.createReserve = async (req, res) => {
    try{
        const client = req.user;
        const {serviceSKU, plate, dateTime, addComent} = req.body;

        // Validações básicas
        if (!serviceSKU || !plate || !dateTime) {
            return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
        }
        
        const vehicle = await Vehicle.findOne({clientID: client._id, plate: plate});
        if(!vehicle) return res.status(404).json({sucess:false, message: "Veículo não encontrado"});
        
        const {serviceIDs, startTime, endTime} = await reserveUtil.calculateReserveData(serviceSKU, dateTime);

        const reserve = new Reserve({ 
            clientID: client._id,
            vehicleID: vehicle._id,
            serviceID: serviceIDs,
            startTime,
            endTime,
            addComent,
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
        if (err instanceof Error && err.message) { //Captura mensagens de erro personalizadas
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.updateReserve = async (req, res) => {
    try{
        const sku = req.params.sku;
        const {startTime, endTime, status} = req.body;

        const reserve = await Reserve.findOne({sku: sku}).populate('serviceID');
        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"}); 

        const serviceSKUs = reserve.serviceID.map(service => service.sku);
        
        if (startTime) {
            const {startTime: newStartTime, endTime: newEndTime } = await reserveUtil.calculateReserveData(serviceSKUs, startTime);
            reserve.startTime = newStartTime;
            reserve.endTime = newEndTime;
        }

        if(endTime) reserve.endTime = new Date(endTime);
        if(status) reserve.status = status;

        await reserve.save();

        res.status(200).json({sucess: true, message: "Reserva atualizada com sucesso", reserve: reserve});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
}

exports.deleteReserve = async (req, res) => {
    try{
        const reserve = await Reserve.findOne({sku: req.params.sku});
        if(!reserve) return res.status(404).json({ sucess: false, message: "Reserva não encontrada" });
            
        await Reserve.findByIdAndDelete(reserve._id);
            
        res.status(200).json({ sucess: true, message: "Reserva removida com sucesso" });
    
    }catch(err){
            console.log(err);
            res.status(500).json({ sucess: false, message: "Erro interno do servidor" });
    }
}