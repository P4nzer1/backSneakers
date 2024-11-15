const express = require('express');
const { getProfile, updateProfile, getUserCart, getUserOrders } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile); // Обновление профиля
router.get('/cart', authMiddleware, getUserCart); // Получение корзины пользователя
router.get('/orders', authMiddleware, getUserOrders); // Получение заказов пользователя

module.exports = router;
