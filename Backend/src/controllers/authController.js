const User = require('../models/user');
const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const univUtil = require('../utils/univUtil');

exports.register = async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;

        const token = crypto.randomBytes(32).toString("hex");

        const client = new Client({
            name, phone, email, password,
            verificationToken: token,
            isVerified: false
        });

        const verificationLink = `${process.env.BASE_URL}/auth/verify/${token}`;

        await univUtil.sendEmail(email, 'Confirme seu email', `
            <h2>Bem-vindo à Pena Customs!</h2>
            <p>Clique no link abaixo para verificar seu email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
        `);
        
        await client.save();

        res.status(201).json({ success: true, message: "Conta criada!\nProssiga com a validação no email." });

    }catch(err){
        console.error(err);
        if (err instanceof Error && err.message) {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};


exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        //if(!user.isVerified) return res.status(403).json({ success: false, message: "Utilizador não encontrado" });
        if(user.__t == 'Clients' && !user.isVerified) return res.status(403).json({ success: false, message: "Email não verificado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ success: false, message: "Password errada" });

        const token = jwt.sign(
            {id: user._id, role: user.__t},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE_IN}
        );

        res.status(200).json({ success: true, token, role: user.__t });

    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno no servidor" });
    }
};

exports.emailVerify = async (req, res) => {
    try{
        const token = req.params.token;
        const user = await User.findOne({verificationToken: token});

        if(!user) return res.status(404).json({ success: false, message: "Token inválido" });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send("Email verificado com sucesso!");

    }catch(err){
        console.error(err);
        res.status(500).send("Erro interno ao verificar email");
    }
};