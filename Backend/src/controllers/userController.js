const User = require('../models/user');

// Controlador usado para o Admin obter todos os utilizadores
exports.getAllUsers = async (req, res) => {
    try {
        const {s, sortBy = 'name', order = 'asc'} = req.query;

        let query = {};
        if (s) {
            query = {
                $or: [
                    { name: new RegExp(s, 'i') },
                    { email: new RegExp(s, 'i') }
                ]
            };
        }

        const sortOrder = order === 'desc' ? -1 : 1;

        const users = await User.find(query).sort({ [sortBy]: sortOrder });

        res.status(200).json({ success: true, users });

    } catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
};

// Controlador usado para o Utilizador obter os seus dados pessoais
exports.getUserAuth = async (req, res) => {
    try{
        /* const user = await User.findById(req.user._id);
           if(!user) return res.status(404).json({ sucess: false, message: "Utilizador não encontrado" }); */
        
        res.status(200).json({
            sucess: true,
            message: "Utilizador encontrado com sucesso",
            client: req.user /*user*/
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ sucess:false, message: "Erro interno do servidor" });
    }
}

// Controlador usado para o Utilizador atualizar os seus dados pessoais
exports.updateUserAuth = async (req, res) => {
    try{

        const {name, phone, email} = req.body;
        const user = req.user;
       
        // Atualiza os dados do Utilizador
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.email = email || user.email;

        /* Atualiza os dados do Utilziador na Base de Dados, ativando o Middleware
           Foi decidido usar o 'save' e não '*update*', para reutilização de código */
        await user.save();

        /* TOIMP in case 
        await User.updateOne(
            { _id: user._id }, 
            { name: user.name, 
              phone: user.phone,
              email: user.email 
            }
        ); */

        res.status(200).json({ success: true, message: "Utilizador atualizado com sucesso", user: user });

    }catch(err){
        console.log(err);
        
        if (err instanceof Error && err.message) { //Captura mensagens de erro personalizadas
            return res.status(400).json({ success: false, message: err.message });
        }
        
        res.status(500).json({sucess: false, message: "Erro interno do servidor" });
    }
};

// Controlador usado para caso o Utilizador queira excluir o seu perfil 
exports.deleteUserAuth = async (req, res) => {
    try{
        const user = req.user;
        
        /* Remove o Utilizador da base de dados
           Foi realizada a verificação do discriminator, pois caso seja 'Clients', ativa o seu Middleware prensete em client.js */
        if(user.__t === 'Clients'){
            await User.findOneAndDelete({ _id: user._id });
        }else{
            await User.findByIdAndDelete(user._id);
        }

        res.status(200).json({ sucess: true, message: "Utilizador removido com sucesso" });

    }catch(err){
        console.log(err);
        res.status(500).json({ sucess: false, message: "Erro interno do servidor" });
    }
};