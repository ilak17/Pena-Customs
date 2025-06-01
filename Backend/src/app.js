const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:3001', // URL do frontend
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

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