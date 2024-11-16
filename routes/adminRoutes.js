const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');


router.post('/admin-action', authMiddleware, roleMiddleware(['admin']), adminController.performAdminAction);

module.exports = router;
