const express = require('express');
const { addToCart, getCart, updateCart, clearCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/', addToCart);        
router.get('/', getCart);            
router.put('/', updateCart);          
router.delete('/', clearCart);       

module.exports = router;
