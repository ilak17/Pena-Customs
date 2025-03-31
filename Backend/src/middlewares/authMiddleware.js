const jwt = require('jsonwebtoken');
const User = require('../models/user');

/* Middleware para verificar se o utilizador está autenticado
   Este middleware deve ser usado em todas as rotas que requerem autenticação */
exports.authenticateUser = async (req, res, next) =>{

    // Verifica a presença do JWT no Header da requisição
    const authHeader = req.headers.authorization; 
    if(!authHeader) return res.status(401).json({ success: false, message: "Token não fornecido" });

    const token = authHeader.split(' ')[1]; // Extrai o token do Header removendo o "Bearer"

    /* Verifica a validade do token e procura o utilizador correspondente no banco de dados
       Por questões de segurança, removemos a password do utilizador da resposta */
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id).select('-password -__v');
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        
        req.user = user;
        next();

    }catch(err){
        console.error(err);
        res.status(401).json({ success: false, message: "Token inválido" });
    }
}

/* Middleware para verificar se o utilizador autenticado é Admin
   Este middleware deve ser usado apenas em rotas que requerem acesso de administrador */
exports.isAdmin = (req, res, next) => {

    if(req.user && req.user.__t === "Admins"){
      return next();
    }else{
      return res.status(403).json({ success: false, message: "Acesso negado. Somente administradores podem acessar esta rota." });
    }
};