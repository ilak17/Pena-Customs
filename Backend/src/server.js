const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Conectado ao MongoDB!"))

    .catch(err => {
        console.log("Erro ao conectar ao MongoDB")
        throw err;
    });

app.listen(PORT, () => {
    console.log(`Servidor aberto na porta ${PORT}`);
});
//Teste