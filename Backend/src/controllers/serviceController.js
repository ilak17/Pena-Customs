const Service = require('../models/service');

exports.createService = async (req, res) => {
    try{
        const {name, price, description} = req.body;
        const status = "available";
        const service = new Service({name, price, description, status});
        await service.save();
        res.status(201).json(service);
    }catch(err){
        console.log(err);
        res.status(500).json({sucess:false, message: "Erro interno do servidor"});
    }
}

exports.getAllServices = async (req, res) => {
    try{
        const service = await Service.find();
        res.status(201).json({ sucess: true, message: service });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}