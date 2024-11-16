const csrf = require('csurf');

const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // Разрешаем доступ к токену с клиентской стороны (если нужно)
    secure: false,   // Включите true для HTTPS
    sameSite: 'Lax', // Защита от CSRF-атак
  },
});

// Middleware для обработки CSRF
const csrfMiddleware = (req, res, next) => {
  res.cookie('_csrf', req.csrfToken(), {
    httpOnly: false, // Делаем токен доступным для фронтенда
    secure: false,   // Используйте true в продакшене
    sameSite: 'Lax', // Защита от CSRF-атак
  });
  next();
};

module.exports = {
  csrfProtection,
  csrfMiddleware,
}; 

