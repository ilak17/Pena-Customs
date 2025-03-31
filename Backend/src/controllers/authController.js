const User = require('../models/user');
const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "E-mail já registrado" });

        const client = new Client({name, phone, email, password});
        await client.save();

        res.status(201).json({ success: true, message: "Cliente registado com sucesso!" });
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};


exports.login = async (req, res) => {
    try{

        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ success: false, message: "Password errada" });

        const token = jwt.sign(
            {id: user._id, role: user.__t},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE_IN}
        );

        res.status(200).json({ success: true, token, role: user.__t });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno no servidor" });
  }
};