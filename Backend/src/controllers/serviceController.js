const Service = require('../models/service');

// Obtem todos os serviços
exports.getAllServices = async (req, res) => {
    try{
        // sortBy, orderBy, s são os parâmetros de pesquisa
        const {s, sortBy = 'name', order = 'asc'} = req.query;

        let query = {};
        if(s){
            query = {
                $or: [
                    { name: new RegExp(s, 'i') },
                    { sku: new RegExp(s, 'i') }
                ]
            };
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const service = await Service.find(query).sort({ [sortBy]: sortOrder });
        if(!service) return res.status(404).json({ sucess: false, message: "Serviços não encontrado" });

        res.status(201).json({ sucess: true, message: service });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

// Obtem um serviço por SKU
exports.getServiceBySku = async (req, res) =>{
    try{
        const sku = req.params.sku;

        const service = await Service.findOne({sku: sku});
        if(!service) return res.status(404).json({ sucess: false, message: "Serviço não encontrado" });
        
        res.status(200).json({ sucess: true, message: service });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

// Cria um serviço
exports.createService = async (req, res) => {
    try{
        const {name, price, description} = req.body;
        let estimatedTime = req.body.estimatedTime;

        if(!name  || !price || !description || !estimatedTime){
            return res.status(400).json({ sucess: false, message: "Preencha os valores obrigatórios" });
        }

        const status = "available"; // status default
        const service = new Service({name, price, description, estimatedTime, status});

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

// Atualiza um serviço
exports.updateService = async (req, res) => {
    try{
        const id = req.params.id;
        const {name, price, description, estimatedTime, status} = req.body;

        const service = await Service.findOne({_id: id});
        if(!service) return res.status(404).json({ sucess: false, message: "Serviço não encontrado" });

        service.name = name || service.name;
        service.price = price || service.price;
        service.description = description || service.description;
        service.estimatedTime = estimatedTime || service.estimatedTime;
        service.status = status || service.status;

        await service.save();
        res.status(200).json({ sucess: true, message: "Serviço atualizado com sucesso", service: service });

    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

//Apaga um serviço
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