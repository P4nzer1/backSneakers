const express = require('express');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Конфигурация multer для сохранения файлов в папку "uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Путь для сохранения изображений
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
  }
});

// Фильтр для проверки типа файла (только изображения)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Допускаются только изображения'), false);
  }
};

// Настройка multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Маршруты
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images', 5), createProduct);

module.exports = router;
