const express = require('express');
const { getProducts, getProductById, createProduct, getBrands } = require('../controllers/productController');
const router = express.Router();
const upload = require('../config/multer')

// Маршруты
router.get('/', getProducts);
router.get('/brands', getBrands)
router.get('/:id', getProductById);
router.post('/', upload.array('images', 5), createProduct);

module.exports = router;
