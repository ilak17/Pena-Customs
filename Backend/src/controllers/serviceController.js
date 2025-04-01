const Service = require('../models/service');

exports.getAllServices = async (req, res) => {
    try{
        const service = await Service.find();
        res.status(201).json({ sucess: true, message: service });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

exports.getServiceBySku = async (req, res) =>{
    try{
        const sku = req.params.sku;

        const service = Service.findOne({sku: sku});
        if(!service) return res.status(404).json({ sucess: false, message: "Serviço não encontrado" });

        res.status(200).json({ sucess: true, message: service });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

exports.createService = async (req, res) => {
    try{
        const {name, price, description} = req.body;
        
        const status = "available";
        const service = new Service({name, price, description, status});

        await service.save();

        res.status(201).json({
            sucess: true, 
            message: "Serviço criado com sucesso", 
            service: service
        });

    }catch(err){
        console.log(err);
        res.status(500).json({sucess:false, message: "Erro interno do servidor"});
    }
}

exports.updateService = async (req, res) => {
    try{
        const id = req.params.id;
        const {name, price, description, status} = req.body;

        const service = await Service.findOne({_id: id});
        if(!service) return res.status(404).json({ sucess: false, message: "Serviço não encontrado" });

        service.name = name || service.name;
        service.price = price || service.price;
        service.description = description || service.description;
        service.status = status || service.status;

        await service.save();
        res.status(200).json({ sucess: true, message: "Serviço atualizado com sucesso", service: service });

    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

exports.deleteService = async (req, res) => {
    try{
        const id = req.params.id;

        const service = await Service.findOne({_id: id});
        if(!service) return res.status(404).json({ sucess: false, message: "Serviço não encontrado" });
        
        await service.deleteOne();

        res.status(200).json({ sucess: true, message: "Serviço eliminado com sucesso"});

    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}