const Admin = require('../models/admin');
const User = require('../models/user');

// Cria um novo administrador
exports.createAdmin = async (req, res) => {
    try {
        const {name, phone, email, password} = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "E-mail já registrado" });

        const admin = new Admin({name, phone, email, password});
        await admin.save();

        res.status(201).json({ success: true, admin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};