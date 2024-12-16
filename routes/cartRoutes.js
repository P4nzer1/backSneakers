const express = require('express');
const { addToCart, getCart, updateCart, clearCart, removeCartItem } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addToCart);        
router.get('/', authMiddleware, getCart);            
router.put('/', authMiddleware, updateCart);          
router.delete('/', authMiddleware, clearCart);       
router.delete('/:itemId', authMiddleware, removeCartItem);

module.exports = router;
