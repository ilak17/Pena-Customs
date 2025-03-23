const Client = require('../models/client');

exports.createClient = async (req, res) => {
    try{
        const {name, phone, email, password} = req.body;
        const client = new Client({name, phone, email, password/*, role: "client"*/});
        await client.save();
        res.status(201).json(client);
    }catch(err){
        console.log(err);
        res.status(500).json({sucess:false, message: "Erro interno do servidor"});
    }
};