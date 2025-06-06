const Admin = require('../models/admin');
const User = require('../models/user');
const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Service = require('../models/service');
const reserveUtil = require('../utils/reserveUtil');

// Cria um novo administrador
exports.createAdmin = async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "E-mail já registrado" });

        const admin = new Admin({name, phone, email, password});
        await admin.save();

        res.status(201).json({ success: true, admin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isVerified } = req.body;

        // Verifica se o utilizador existe
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
      
        user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;

        // Salva as alterações na Base de Dados
        await user.save();

        res.status(200).json({ success: true, message: "Utilizador atualizado com sucesso", user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });

        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "Utilizador eliminado com sucesso" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};

// Obtem todas as reservas
exports.getAllReserves = async (req, res) => {
    try{

        // sortBy, orderBy, s são os parâmetros de pesquisa
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

        res.status(200).json({success: true, message: reserves});
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

// Atualiza reserva
exports.updateReserve = async (req, res) => {
    try{
        const sku = req.params.sku;
        const {startTime, endTime, addComent, status} = req.body;

        const reserve = await Reserve.findOne({ sku })
            .populate({ path: 'clientID', select: 'name email' })
            .populate('serviceID');        
            
        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"}); 

        const serviceSKUs = reserve.serviceID.map(service => service.sku); // Obtem os SKUs dos serviços da reserva
        
        if (startTime) {
            const {startTime: newStartTime, endTime: newEndTime } = await reserveUtil.calculateReserveData(serviceSKUs, startTime); // Obtem os serviços e calcula o tempo de reserva
            reserve.startTime = newStartTime;
            reserve.endTime = newEndTime;
        }

        if(endTime) reserve.endTime = new Date(endTime);

        if(addComent) reserve.addComents = addComent;

        if(status && status != "pending"){ //Envia email de atualizaçao do estado da reserva
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
};

exports.getDbStatus = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const totalServices = await Service.countDocuments();
        const totalReserves = await Reserve.countDocuments();

        res.status(200).json({
            success: true,
            message: {
                totalUsers,
                totalVehicles,
                totalServices,
                totalReserves
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
}