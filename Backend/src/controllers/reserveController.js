const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');
const Service = require('../models/service');

// Obtem uma reserva por SKU
exports.getReserveBySKU = async (req, res) => {
    try{
        const sku = req.params.sku;
        const reserve = await Reserve.findOne({ clientID: req.user._id, sku: sku })
            .populate('clientID', 'name phone email -__t -_id')
            .populate('vehicleID', '-__v -clientID -_id')
            .populate('serviceID', '-status -__v')
        ;
        if(!reserve) return res.status(404).json({sucess:false, message: "Reserva não encontrado"});

        res.status(200).json({success: true, message: reserve});

    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Erro interno no servidor"});
    }
}

// Obtem todas as reservas de um cliente
exports.getMyReserves = async (req, res) => {
    try{
        const client = req.user;

        // sortBy, orderBy, s são os parâmetros de pesquisa
        const {
            s,
            sortBy = 'startTime',
            order = 'asc',
            page = 1,
            limit = 6
        } = req.query;

        let query = { clientID: client._id };
        
        if(s){
            // Primeiro, encontra os veículos que correspondem à pesquisa
            const vehicles = await Vehicle.find({
                plate: new RegExp(s, 'i')
            }).select('_id');

            const vehicleIds = vehicles.map(v => v._id);

            query = {
                clientID: client._id,
                $or: [
                    { sku: new RegExp(s, 'i') },
                    { vehicleID: { $in: vehicleIds } },
                    { status: new RegExp(s, 'i') }
                ]
            };
        }

        const sortOrder = order === 'desc' ? -1 : 1;

        // Calcular total de documentos e páginas
        const total = await Reserve.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Buscar reservas com paginação
        const reserves = await Reserve.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('clientID')
            .populate('vehicleID')
            .populate('serviceID');

        if(!reserves) return res.status(404).json({success: false, message: "Reservas não encontradas"});

        res.status(200).json({
            success: true,
            message: reserves,
            pagination: {
                total,
                totalPages,
                currentPage: Number(page),
                itemsPerPage: Number(limit)
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Erro interno no servidor"});
    }
};

// Criar reserva
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
        
        const {serviceIDs, startTime, endTime} = await reserveUtil.calculateReserveData(serviceSKU, dateTime); // Obtem os serviços e calcula o tempo de reserva

        // Cria nova reserva e guarda na base de dados
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

        await reserve.populate('clientID', 'name email');

        // Envia email da criaçao reserva
        await reserveUtil.sendStatusEmail({
            reserveStatus: reserve.status, 
            reserveSKU: reserve.sku,
            clientName: reserve.clientID.name,
            clientEmail: reserve.clientID.email
        });

        res.status(201).json({
            success: true,
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

// Apaga a reserva
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