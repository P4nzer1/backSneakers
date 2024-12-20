const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const xssClean = require('xss-clean');
const corsMiddleware = require('./middleware/corsMiddleware');
const limiter = require('./middleware/rateLimiter');
const cookieParser = require('cookie-parser');

const handleError = require('./middleware/errorHandlerMiddleware');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();

// === Middleware ===
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(xssClean());
app.use('/api/', limiter);

app.get('/', (req, res) => {
  res.send('Сервер работает успешно!');
});

// === Статические файлы ===
app.use('/uploads', express.static('uploads'));

// === Маршруты ===
app.use('/', homeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', profileRoutes);
app.use('/api', adminRoutes);

// === Обработка ошибок ===
app.use(handleError);

if (require.main === module) {
  const PORT = process.env.PORT || process.env.TEST_PORT || 0;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
