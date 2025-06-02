const multer = require('multer');
const path = require('path');

// Função de filtro de imagem reutilizável
const imageFilter = function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Apenas imagens nos formatos JPG, JPEG e PNG são permitidas!'));
};

// Configurações de storage
const storageVehicle = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/vehicles');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const storageService = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/services');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Função geradora de middleware de upload
const createUploader = (storage) => multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter
}).single('image');

module.exports = {
    storageVehicle,
    storageService,
    createUploader
};