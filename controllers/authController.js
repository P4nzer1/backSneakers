const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  console.log('Регистрация запущена');
  try {
    const { email, password, name } = req.body;

    console.log('Данные запроса:', { email, password: 'скрыт', name });

    if (!email || !password || !name) {
      console.log('Ошибка: Одно из обязательных полей отсутствует');
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Ошибка: Пользователь с таким email уже существует');
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = new User({ email,  password: hashedPassword, name, role: 'user'  });
    await user.save();

    console.log('Регистрация успешна. Пользователь создан:', user._id);
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Логин запущен. Данные запроса:', { email, password: 'скрыт' });

  try {
    const user = await User.findOne({ email });
    console.log('Найденный пользователь:', user);

    if (!user) {
      console.log('Ошибка: Неверные учетные данные (пользователь не найден)');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Результат проверки пароля:', isMatch);

    if (!isMatch) {
      console.log('Ошибка: Неверные учетные данные (пароль не совпадает)');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('Токены сгенерированы:', { accessToken, refreshToken });

    const token = new Token({ userId: user._id, token: refreshToken });
    await token.save();

    console.log('Токен сохранён в базе:', token._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: 'Strict',
    });

    res.json({ refreshToken, accessToken });
  } catch (error) {
    console.error('Ошибка при логине:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

  

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log('Запрос на обновление токена. Refresh token:', refreshToken);

    if (!refreshToken) {
      console.log('Ошибка: Отсутствует refresh token');
      return res.status(403).json({ message: 'Refresh token required' });
    }

    const existingToken = await Token.findOne({ token: refreshToken });
    console.log('Найденный refresh token в базе:', existingToken);

    if (!existingToken) {
      console.log('Ошибка: Неверный refresh token');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('Декодированные данные токена:', decoded);

    const user = await User.findById(decoded.id);
    console.log('Найденный пользователь:', user);

    if (!user) {
      console.log('Ошибка: Пользователь не найден');
      return res.status(403).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    existingToken.token = newRefreshToken;
    await existingToken.save();

    console.log('Токены обновлены:', { newAccessToken, newRefreshToken });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log('Запрос на логаут. Refresh token:', refreshToken);

    if (!refreshToken) {
      console.log('Ошибка: Отсутствует refresh token');
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    await Token.findOneAndDelete({ token: refreshToken });
    console.log('Refresh token удалён из базы');

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    console.log('Access token удалён из куков');
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Ошибка при логауте:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

