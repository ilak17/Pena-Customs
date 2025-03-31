const Client = require('../models/client');
const Vehicle = require('../models/vehicle');

exports.createVehicle = async (req, res) => {
    try{
        const {plate, brand, model} = req.body

        const client = await Client.findById(req.user._id);
        if(!client){
            return res.status(404).json({sucess:false, message: "Cliente não encontrado"});
        }

        // Verifica se já existe um veículo com esta placa
        const existingVehicle = await Vehicle.findOne({plate});
        if(existingVehicle){
            return res.status(400).json({sucess:false, message: "Este veículo já está cadastrado" });
        }

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
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

exports.getAllVehicles = async (req, res) => {
    try{
        const vehicle = await Vehicle.getAllVehicles();
        res.status(200).json(vehicle);
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

exports.getAllMyVehicles = async (req, res) => {
    try{
        const user = Client.findById(req.user._id);
        if(!user) return res.status(404).json({sucess: false, message: "Cliente não encontrado"});

        const vehicles = await Vehicle.find({clientID: user._id});
        if(!vehicles) return res.status(404).json({sucess: false, message: "Veículo(s) não encontrado(s)"});
       
        res.status(200).json({sucess: true, message: vehicles});

    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message: "Erro interno no servidor"});
    }
};

exports.getVehicleById = async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id);
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

exports.deleteVehicle = async (req, res) => {
    try {
        const client = Client.findById(req.user._id);
        if(!client) return res.status(404).json({ success: false, message: "Cliente não encontrado" });
        
        const vehicle = await Vehicle.findOne({_id: req.params.id, clientID: client._id});
        if (!vehicle) {
            return res.status(404).json({success: false, message: "Veículo não encontrado"});
        }

        await vehicle.deleteOne(); // Chama o middleware para remover o veículo do cliente

        res.status(200).json({success: true, message: "Veículo excluído com sucesso"});
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: "Erro interno no servidor"});
    }
};

exports.updateVehicle = async (req, res) => {
    try{ 
        const {plate, brand, model} = req.body; 

        const client = await Client.findById(req.user._id); 
        if(!client) return res.status(404).json({ success: false, message: "Cliente não encontrado" });

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