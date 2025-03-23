const mongoose = require('mongoose');
const User = require("./user");

const adminSchema = new mongoose.Schema(); 

module.exports = User.discriminator('Admins', adminSchema);