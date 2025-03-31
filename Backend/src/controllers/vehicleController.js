const Client = require('../models/client');
const Vehicle = require('../models/vehicle');

// Controlador usado para o Admin obter todos os veícluos
exports.getAllVehicles = async (req, res) => {
    try{
        const vehicle = await Vehicle.find();
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
    try{
        const {plate, brand, model} = req.body

        const client = req.user;
        
        const clientID = client._id;
        const vehicle = new Vehicle({clientID, plate, brand, model});
        await vehicle.save();

        client.vehicles.push(vehicle);

        await client.save();
            
        res.status(201).json({
            sucess: true,
            message: "Veículo guardado com sucesso",
            vehicle: vehicle
        });

    }catch(err){
        console.log(err);

        if (err instanceof Error && err.message) { //Captura mensagens de erro personalizadas
            return res.status(400).json({ success: false, message: err.message });
        }

        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

// Controlador para o Cliente atualizar os dados do seu Veículo
exports.updateMyVehicle = async (req, res) => {
    try{ 
        const {brand, model} = req.body; 
        const plate = req.params.plate;

        const client = req.user; 

        const vehicle = await Vehicle.findOne({clientID: client._id, plate: plate});
        if(!vehicle) return res.status(404).json({ success: false, message: "Veículo não encontrado" });

        vehicle.brand = brand || vehicle.brand;
        vehicle.model = model || vehicle.model;
        
        await vehicle.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Veículo atualizado com sucesso", 
            vehicle: vehicle 
        });

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
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