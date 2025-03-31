const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = async (req, res, next) =>{

    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ success: false, message: "Token não fornecido" });

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ success: false, message: "Token inválido" });
    }
}

exports.isAdmin = (req, res, next) => {
    // Verifica se o usuário autenticado possui __t "Admins"
    if(req.user && req.user.__t === "Admins"){
      return next();
    }else{
      return res.status(403).json({ success: false, message: "Acesso negado. Somente administradores podem acessar esta rota." });
    }
};