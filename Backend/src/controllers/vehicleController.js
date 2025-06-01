const Client = require('../models/client');
const Vehicle = require('../models/vehicle');
const multer = require('multer');
const path = require('path');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/vehicles')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens nos formatos JPG, JPEG e PNG são permitidas!'));
    }
}).single('image');

// Controlador usado para o Admin obter todos os veícluos
exports.getAllVehicles = async (req, res) => {
    try{
        
        // sortBy, orderBy, s são os parâmetros de pesquisa
        const {s, sortBy = 'plate', order = 'asc'} = req.query;

        let query = {};
        if(s){
            query = {
                $or: [
                    { plate: new RegExp(s, 'i') },
                    { brand: new RegExp(s, 'i') },
                    { model: new RegExp(s, 'i') }
                ]
            };
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const vehicle = await Vehicle.find(query).sort({ [sortBy]: sortOrder });

        if(!vehicle) return res.status(404).json({ sucess: false, message: "Veículo(s) não encontrado(s)" });

        res.status(200).json({ sucess: true, message: vehicle });
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

// Controlador usado para o Cliente obter todos os seus veículos
exports.getAllMyVehicles = async (req, res) => {
    try{
        const vehicle = await Vehicle.find({clientID: req.user._id});
        if(!vehicle) return res.status(404).json({sucess: false, message: "Veículo(s) não encontrado(s)"});
       
        res.status(200).json({sucess: true, message: vehicle});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

// Controlador para o Cliente obter os dados do seu Veículo
exports.getMyVehicle = async (req, res) => {
    try{

        //verifica a existência de veículos através da Matrícula na fica do Cliente
        const vehicle = await Vehicle.findOne({clientID: req.user._id, plate: req.params.plate});
        if(!vehicle) return res.status(404).json({sucess: false, message: "Veículo não encontrado"});

        res.status(200).json({
            sucess: true,
            message: "Veículo encontrado com sucesso",
            vehicle: vehicle
        });
        
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

// Controlador usado para o Cliente criar um veículo
exports.createVehicle = async (req, res) => {
    try {
        upload(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({success: false, message: "Erro no upload da imagem"});
            } else if (err) {
                return res.status(400).json({success: false, message: err.message});
            }

            const {plate, brand, model} = req.body;
            const client = req.user;
            const clientID = client._id;

            const vehicle = new Vehicle({
                clientID,
                plate,
                brand,
                model,
                image: req.file ? `/uploads/vehicles/${req.file.filename}` : null
            });

            await vehicle.save();
            client.vehicles.push(vehicle);
            await client.save();
                
            res.status(201).json({
                success: true,
                message: "Veículo guardado com sucesso",
                vehicle: vehicle
            });
        });
    } catch(err) {
        console.log(err);
        if (err instanceof Error && err.message) {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({success: false, message: "Erro interno no servidor"});
    }
};

// Controlador para o Cliente atualizar os dados do seu Veículo
exports.updateMyVehicle = async (req, res) => {
    try{ 
        upload(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({success: false, message: "Erro no upload da imagem"});
            } else if (err) {
                return res.status(400).json({success: false, message: err.message});
            }

            const {brand, model} = req.body; 
            const plate = req.params.plate;
            const client = req.user; 

            const vehicle = await Vehicle.findOne({clientID: client._id, plate: plate});
            if(!vehicle) return res.status(404).json({ success: false, message: "Veículo não encontrado" });

            vehicle.brand = brand || vehicle.brand;
            vehicle.model = model || vehicle.model;
            if (req.file) {
                vehicle.image = `/uploads/vehicles/${req.file.filename}`;
            }
            
            await vehicle.save();
            
            res.status(200).json({ 
                success: true, 
                message: "Veículo atualizado com sucesso", 
                vehicle: vehicle 
            });
        });
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Erro interno no servidor"});
    }
};

// Controlador para o Cliente eliminar os dados do seu Veículo
exports.deleteVehicle = async (req, res) => {
    try {
        const client = req.user;

        const vehicle = await Vehicle.findOne({clientID: client._id, plate: req.params.plate});
        if(!vehicle) return res.status(404).json({success: false, message: "Veículo não encontrado"});

        await vehicle.deleteOne(); // Chama o middleware para remover o veículo do cliente

        res.status(200).json({success: true, message: "Veículo excluído com sucesso"});
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: "Erro interno no servidor"});
    }
};