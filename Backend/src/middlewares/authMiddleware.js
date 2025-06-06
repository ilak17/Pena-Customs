const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BlacklistedToken = require('../models/tokenBlacklist');

/* Middleware para verificar se o utilizador está autenticado
   Este middleware deve ser usado em todas as rotas que requerem autenticação */
exports.authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];

        // Verifica se o token está na blacklist
        const blacklisted = await BlacklistedToken.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }

        // Verifica se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Busca o utilizador e remove informações sensíveis
        const user = await User.findById(decoded.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado' });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
    }
};

/* Middleware para verificar se o utilizador autenticado é Admin
   Este middleware deve ser usado apenas em rotas que requerem acesso de administrador */
exports.isAdmin = (req, res, next) => {
    if(req.user && req.user.__t === "Admins"){
      return next();
    }else{
      return res.status(403).json({ success: false, message: "Acesso negado. Somente administradores podem acessar esta rota." });
    }
};