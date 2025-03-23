const Admin = require('../models/admin');

exports.createAdmin = async (req, res) => {
    try{
        const {name, phone, email, password} = req.body;
        const admin = new Admin({name, email, password, phone/*, role: "admin"*/});
        await admin.save();
        res.status(201).json({sucess: true, admin: admin});
    }catch(err){
        console.log(err);
        res.status(500).json({sucess:false, message: "Erro interno do servidor"});
    }
};