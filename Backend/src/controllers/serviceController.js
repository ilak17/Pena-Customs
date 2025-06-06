const Service = require('../models/service');
const uploadUtil = require('../utils/uploadUtil')
const multer = require('multer');
const upload = uploadUtil.createUploader(uploadUtil.storageService);

// Obtem todos os serviços
exports.getAllServices = async (req, res) => {
    try {
        const {
            s,                          // termo de pesquisa
            sortBy = 'name',           // campo para ordenação
            order = 'asc',             // direção da ordenação
            page = 1,                  // página atual
            limit = 6,                 // itens por página
            category,                  // filtro por categoria
            minPrice,                  // preço mínimo
            maxPrice,                  // preço máximo
            status                     // filtro por status
        } = req.query;

        let query = {};

        // Filtro de pesquisa
        if (s) {
            query.$or = [
                { name: new RegExp(s, 'i') },
                { sku: new RegExp(s, 'i') },
                { description: new RegExp(s, 'i') },
                { category: new RegExp(s, 'i') }
            ];
        }

        // Filtro por categoria
        if (category) {
            query.category = new RegExp(category, 'i');
        }

        // Filtro por status
        if (status) {
            query.status = status;
        }

        // Filtro por preço
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        
        // Calcular total de documentos e páginas
        const total = await Service.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        
        // Buscar serviços com paginação
        const services = await Service.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        if (!services) {
            return res.status(404).json({ success: false, message: "Serviços não encontrados" });
        }

        res.status(200).json({
            success: true,
            message: services,
            pagination: {
                total,
                totalPages,
                currentPage: Number(page),
                itemsPerPage: Number(limit)
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
}

// Obtem um serviço por SKU
exports.getServiceBySku = async (req, res) =>{
    try{
        const sku = req.params.sku;

        const service = await Service.findOne({sku: sku});
        if(!service) return res.status(404).json({ success: false, message: "Serviço não encontrado" });
        
        res.status(200).json({ success: true, message: service });
    }catch(err){
        console.log(err);
        res.status(500).json({ success:false, message: "Erro interno do servidor" });
    }
}

// Cria um serviço
exports.createService = (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            const { category, name, price, description, estimatedTime, status } = req.body;

            if (!category || !name || !price || !description || !estimatedTime || !status) {
                return res.status(400).json({ success: false, message: "Preencha os valores obrigatórios" });
            }

            const imagePath = req.file ? `/uploads/services/${req.file.filename}` : null;

            const service = new Service({
                category,
                name,
                price,
                description,
                estimatedTime,
                status,
                image: imagePath
            });

            await service.save();

            res.status(201).json({
                success: true,
                message: service
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    });
};

// Atualiza um serviço
exports.updateService = (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            const id = req.params.id;
            const { category, name, price, description, estimatedTime, status } = req.body;

            const service = await Service.findById(id);
            if (!service) {
                return res.status(404).json({ success: false, message: "Serviço não encontrado" });
            }

            // Atualiza os campos, mantendo os existentes se não forem enviados
            service.category = category || service.category;
            service.name = name || service.name;
            service.price = price || service.price;
            service.description = description || service.description;
            service.estimatedTime = estimatedTime || service.estimatedTime;
            service.status = status || service.status;

            // Se houver nova imagem enviada, atualiza o campo
            if (req.file) {
                service.image = `/uploads/services/${req.file.filename}`;
            }

            await service.save();

            res.status(200).json({
                success: true,
                message: "Serviço atualizado com sucesso",
                service: service
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    });
}

//Apaga um serviço
exports.deleteService = async (req, res) => {
    try{
        const id = req.params.id;

        const service = await Service.findOne({_id: id});
        if(!service) return res.status(404).json({ suvcess: false, message: "Serviço não encontrado" });
        
        await service.deleteOne();

        res.status(200).json({ success: true, message: "Serviço eliminado com sucesso"});

    }catch(err){
        console.log(err);
        res.status(500).json({ success:false, message: "Erro interno do servidor" });
    }
}