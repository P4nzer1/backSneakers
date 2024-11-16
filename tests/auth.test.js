const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

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
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Должен зарегистрировать нового пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Тестовый Пользователь',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Пользователь успешно зарегистрирован');
  });
});
