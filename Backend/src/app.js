const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Rotas
const reportRoute = require('./routes/reportRoute');
app.use('/report', reportRoute);

const authRoute = require('./routes/authRoute');
app.use('/auth', authRoute);

const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

const vehicleRoute = require('./routes/vehicleRoute');
app.use('/vehicle', vehicleRoute);

const reserveRoute = require('./routes/reserveRoute');
app.use('/reserve', reserveRoute);

const serviceRoute = require('./routes/serviceRoute');
app.use('/service', serviceRoute);

app.get('/', (req, res) => {
    res.send('Pena Customns');
});

module.exports = app;