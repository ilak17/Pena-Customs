const User = require('../models/user');
const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const univUtil = require('../utils/univUtil');
const regNpassTemplates = require('../utils/emailTemplates/regNpassTemplates');

// Cria um novo utilizador
exports.register = async (req, res) => {
    try {
        const {name, phone, email, password, confirmPassword} = req.body;

        // Verifica se as passwords
        if (!password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Password e confirmação são obrigatórias" });
        }else 
          
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords não coincidem" });
        }

        // Cria e salva um novo utilizador
        const client = new Client({
            name, phone, email, password,
            isVerified: false
        });

        await client.save();

        // Cria um token de verificação
        const verifyToken = jwt.sign(
            { email: client.email},
            process.env.JWT_SECRET,
            { expiresIn: '5min'}
        );

        // Cria o email de verificação
        const verifyLink = `${process.env.BASE_URL}/auth/verify/${verifyToken}`;
        const verifyMail = regNpassTemplates.confirmRegistrationEmail({ userName: client.name, verifyLink });

        // Envia o email de verificação
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

// Login 
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}); // Procura o utilizador

        if(!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" }); // Verifica se o utilizador existe

        //if(!user.isVerified) return res.status(403).json({ success: false, message: "Utilizador não encontrado" });
        if(user.__t == 'Clients' && !user.isVerified) return res.status(403).json({ success: false, message: "Email não verificado" });

        // Verifica se a password está correta
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ success: false, message: "Password errada" });

        // Cria um token JWT
        const token = jwt.sign(
            {id: user._id, role: user.__t},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE_IN}
        );

        user.__t === 'Admins' ? res.status(200).json({ success: true, isAdmin: true, token}) : res.status(200).json({ success: true, isAdmin: false, token});

    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno no servidor" });
    }
};

// Verifica o email do utilizador após o registo
exports.emailVerify = async (req, res) => {
    try{
        // Vai buscar o token e verifica se é válido
        const token = req.params.verifyToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if(!user) return res.status(404).json({ success: false, message: "Token inválido" });

        // Atualiza o utilizador para verificado
        user.isVerified = true; 
        await user.save();

        res.redirect(`${process.env.WEB_URL}/email-verificado`);

    }catch(err){
        console.error(err);
        res.status(500).send("Erro interno ao verificar email");
    }
};

// Funçao para alterar a password
exports.resetPassword = async (req, res) => {
    try{
        const token = req.params.resetToken;
        const { newPassword, confirmPassword } = req.body;
        
        const decoded  = jwt.verify(token, process.env.JWT_SECRET); //descodifica o token
        
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });

        // Verifica se as password coincidem
        if(newPassword !== confirmPassword) return res.status(400).json({ success: false, message: "As passwords não coincidem" });

        user.password = newPassword;

        await user.save();

        res.status(200).json({ success: true, message: "Password alterada com sucesso" });

    }catch(err){
        console.error(err);
        res.status(500).send("Erro interno ao verificar email");
    }
};