const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const xssClean = require('xss-clean');
const corsMiddleware = require('./middleware/corsMiddleware');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/errorHandlerMiddleware');
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


app.use(express.json());
app.use(corsMiddleware);
app.use(xssClean());



// Основные маршруты
app.use('/home', homeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Обработка ошибок
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 6000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
