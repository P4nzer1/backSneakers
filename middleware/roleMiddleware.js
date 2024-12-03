module.exports = (roles) => (req, res, next) => {
  if (!req.user) {
    console.error('Ошибка: req.user не определен. Возможно, authMiddleware не был вызван.');
    return res.status(401).json({ message: 'Authorization required' });
  }

  console.log('Проверка роли пользователя:', req.user.role);

  if (!roles.includes(req.user.role)) {
    console.log('Доступ запрещен: роль пользователя:', req.user.role);
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  next();
};
