const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Авторизация: токен из заголовка:', token);

  if (!token) {
    console.log('Ошибка: Токен отсутствует');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('Ошибка: JWT_SECRET не установлен в переменных окружения');
    return res.status(500).json({ message: 'Server configuration error' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Авторизация: токен успешно декодирован:', decoded);
  
    if (!decoded.id || !decoded.role) {
      console.error('Ошибка: Неполный payload в токене');
      return res.status(401).json({ message: 'Invalid token payload' });
    }
  
    req.user = { id: decoded.id, role: decoded.role }; 
    next();
  } catch (error) {
    console.log('Ошибка авторизации: Неверный токен', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

