const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { registerSchema } = require('../validators/userValidator'); 
const { loginSchema } = require('../validators/userValidator');
const router = express.Router();


const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;
