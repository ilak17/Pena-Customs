const Admin = require('../models/admin');
const User = require('../models/user');
const Reserve = require('../models/reserve');
const Vehicle = require('../models/vehicle');
const Service = require('../models/service');

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

exports.verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isVerified } = req.body;

        // Verifica se o utilizador existe
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
      
        user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;

        // Salva as alterações na Base de Dados
        await user.save();

        res.status(200).json({ success: true, message: "Utilizador atualizado com sucesso", user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });

        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "Utilizador eliminado com sucesso" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};

exports.getDbStatus = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const totalServices = await Service.countDocuments();
        const totalReserves = await Reserve.countDocuments();

        res.status(200).json({
            success: true,
            message: {
                totalUsers,
                totalVehicles,
                totalServices,
                totalReserves
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
}