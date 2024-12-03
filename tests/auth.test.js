const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

describe('Auth API', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Очистка всех коллекций базы данных перед тестами
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany({});
    }
    console.log('Подключение к базе данных установлено.');
  });


  it('Должен зарегистрировать нового пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Тестовый Пользователь',
        email: 'testuser@example.com',
        password: 'password123',
      });

    const savedUser = await User.findOne({ email: 'testuser@example.com' });
    expect(savedUser).not.toBeNull();
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Пользователь успешно зарегистрирован');
  });


  it('Должен войти под зарегистрированным пользователем', async () => {
    console.log('Тест начат: Должен войти под зарегистрированным пользователем');

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    
    console.log('Ответ сервера:', res.body);

    if (res.statusCode !== 200) {
      console.error(`Ошибка: Ожидался статус 200, получен ${res.statusCode}`);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');

    console.log('Тест завершён: Должен войти под зарегистрированным пользователем');
  });
  

  it('Должен получить доступ к маршруту /profile с валидным токеном', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
  
    const token = loginRes.body.accessToken;
  
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toEqual(200); // Проверяем, что статус ответа 200
    expect(res.body).toMatchObject({ // Проверяем, что ответ содержит email и name
      email: 'testuser@example.com',
      name: 'Тестовый Пользователь',
    });
  });

  
  it('Должен получить доступ к маршруту /admin-action с валидным токеном администратора', async () => {
    console.log('Создание учетной записи администратора...');
    const adminUser = new User({
      name: 'Admin User',
      email: 'adminuser@example.com',
      password: await bcrypt.hash('adminpassword123', 10),
      role: 'admin',
    });
    await adminUser.save(); // Сохраняем администратора в базе данных
    
    const savedAdmin = await User.findOne({ email: 'adminuser@example.com' });
    console.log('Сохраненный администратор:', savedAdmin);
  
    console.log('Авторизация администратора...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'adminuser@example.com',
        password: 'adminpassword123',
      });
  
    console.log('Ответ авторизации:', loginRes.body);
  
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('accessToken');
  
    const token = loginRes.body.accessToken;
    console.log('Токен администратора:', token);
  
    console.log('Запрос к защищенному маршруту /admin-action...');
    const res = await request(app)
      .post('/api/admin-action')
      .set('Authorization', `Bearer ${token}`);
  
    console.log('Ответ от /admin-action:', res.body);
  
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Admin action performed');
  });
  
   
  afterAll(async () => {
    await mongoose.disconnect();
    console.log('Отключение от базы данных выполнено.');
  });
});
