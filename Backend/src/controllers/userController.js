const User = require('../models/client');


exports.getAllUsers = async (req, res) => {
    try{
        const user = await User.find();
        res.status(201).json({ sucess: true, message: user });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }

}

exports.getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ sucess: false, message: "Utilizador não encontrado" });
        res.status(200).json({
            sucess: true,
            message: "Utilizador encontrado com sucesso",
            client: user
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

exports.getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ sucess: false, message: "Utilizador não encontrado" });
        res.status(200).json({ 
            sucess: true,
            message: "Utilizador encontrado com sucesso",
            client: user
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ sucess: false, message: "Utilizador não encontrado" });
        
        if(user.__t === 'Clients'){
            await user.deleteOne()
        }else{
            await User.findByIdAndDelete(user._id);
        }

        res.status(200).json({ sucess: true, message: "Utilizador removido com sucesso" });

    }catch(err){
        console.log(err);
        res.status(500).json({ sucess: false, message: "Erro interno do servidor" });
    }
};

exports.updateUser = async (req, res) => {
    try{
        const {name, phone, email} = req.body;
        const userID = req.params.id;
        
        const user = await User.findById(userID);
        if(!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado" });

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ success: true, message: "Utilizador atualizado com sucesso", user: user });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess: false, message: "Erro interno do servidor" });
    }
};