const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Rotas
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

const clientRoute = require('./routes/clientRoute');
app.use('/client', clientRoute);

const vehicleRoute = require('./routes/vehicleRoute');
app.use('/vehicle', vehicleRoute);

const reserveRoute = require('./routes/reserveRoute');
app.use('/reserve', reserveRoute);

app.get('/', (req, res) => {
    res.send('Oficina Mecânica');
});

module.exports = app;