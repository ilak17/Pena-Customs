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

        const reserves = await Reserve.find(query).sort({ [sortBy]: sortOrder })
            .populate('clientID', 'name phone email -__t')
            .populate('vehicleID', '-__v -clientID')
            .populate('serviceID', '-status -__v')
        ;
        
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
        const reserve = await Reserve.findOne({ clientID: req.user._id, sku: sku })
            .populate('clientID', 'name phone email -__t -_id')
            .populate('vehicleID', '-__v -clientID -_id')
            .populate('serviceID', '-status -__v')
        ;

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

        await reserve.populate('clientID', 'name email'); // necessário se quiseres email

        await reserveUtil.sendStatusEmail({
            reserveStatus: reserve.status, 
            reserveSKU: reserve.sku,
            clientName: reserve.clientID.name,
            clientEmail: reserve.clientID.email
        });

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
        const {startTime, endTime, addComent, status} = req.body;

        const reserve = await Reserve.findOne({ sku })
            .populate({ path: 'clientID', select: 'name email' })
            .populate('serviceID');        
            
        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"}); 

        const serviceSKUs = reserve.serviceID.map(service => service.sku);
        
        if (startTime) {
            const {startTime: newStartTime, endTime: newEndTime } = await reserveUtil.calculateReserveData(serviceSKUs, startTime);
            reserve.startTime = newStartTime;
            reserve.endTime = newEndTime;
        }

        if(endTime) reserve.endTime = new Date(endTime);

        if(addComent) reserve.addComents = addComent;

        if(status && status != "pending"){
            reserve.status = status;
            await reserveUtil.sendStatusEmail({
                reserveStatus: reserve.status, 
                reserveSKU: reserve.sku,
                reserveEndTime: reserve.endTime,
                clientName: reserve.clientID.name,
                clientEmail: reserve.clientID.email
            });
        } 

        await reserve.save();

        res.status(200).json({sucess: true, message: "Reserva atualizada com sucesso", reserve: reserve});

    }catch(err){
        console.log(err);
        if (err instanceof Error && err.message) {
            return res.status(400).json({ success: false, message: err.message });
        }
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