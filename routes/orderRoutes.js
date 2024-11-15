const express = require('express');
const { createOrder, getOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/', createOrder);           // Создание нового заказа
router.get('/', getOrders);              // Получение всех заказов пользователя
router.get('/:id', getOrderById);        // Получение заказа по ID
router.delete('/:id', cancelOrder);      // Отмена заказа

module.exports = router;
