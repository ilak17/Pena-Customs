const User = require('../models/user');
const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const univUtil = require('../utils/univUtil');
const emailTemplates = require('../utils/emailTemplates');

exports.register = async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;

        const client = new Client({
            name, phone, email, password,
            isVerified: false
        });

        await client.save();

        const verifyToken = jwt.sign(
            { email: client.email},
            process.env.JWT_SECRET,
            { expiresIn: '5min'}
        );

        const verifyLink = `${process.env.BASE_URL}/auth/verify/${verifyToken}`;
        const verifyMail = emailTemplates.confirmRegistrationEmail({ userName: client.name, verifyLink });

        await univUtil.sendEmail(
            client.email,
            "Confirmação de Registo - Pena Customs",
            verifyMail
        );
        
        res.status(201).json({ success: true, message: "Conta criada! Prossiga com a validação no email." });

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

        res.status(200).json({ success: true, token});

    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno no servidor" });
    }
};

exports.emailVerify = async (req, res) => {
    try{
        const token = req.params.verifyToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if(!user) return res.status(404).json({ success: false, message: "Token inválido" });

        user.isVerified = true;
        await user.save();

        res.send("Email verificado com sucesso!");

    }catch(err){
        console.error(err);
        res.status(500).send("Erro interno ao verificar email");
    }
};

exports.resetPassword = async (req, res) => {
    try{
        const token = req.params.resetToken;
        const { newPassword, confirmPassword } = req.body;
        
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });

        if(newPassword !== confirmPassword) return res.status(400).json({ success: false, message: "As passwords não coincidem" });

        user.password = newPassword;

        user.save();
        res.status(200).json({ success: true, message: "Password alterada com sucesso" });

    }catch(err){
        console.error(err);
        res.status(500).send("Erro interno ao verificar email");
    }
};