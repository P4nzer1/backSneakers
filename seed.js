const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config(); // Подключение переменных окружения из .env

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Тестовые данные
const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
  { name: 'John Doe', email: 'john@example.com', password: 'password123' }
  
];

const products = [
  {
    name: 'Nike Air Force 1',
    price: 15000,
    description: 'Classic white sneakers from Nike.',
    brand: 'Nike',
    stock: 20,
    category: 'Shoes',
    images: [
      '/uploads/AirForce1.jpg',
      '/uploads/AirForce2.jpg'
    ]
  },
];

const orders = [
  {
    userId: new mongoose.Types.ObjectId(),
    products: [
      { productId: new mongoose.Types.ObjectId(), quantity: 1 }
    ],
    totalPrice: 1500
  }
];

// Функция для заполнения данных
const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    await User.insertMany(users);
    await Product.insertMany(products);
    await Order.insertMany(orders);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

seedDatabase();
