const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  console.log('Регистрация запущена');
  try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
          return res.status(400).json({ message: 'Все поля обязательны' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      const user = new User({ email, password, name }); 
      await user.save();

      res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      const token = new Token({ userId: user._id, token: refreshToken });
      await token.save();
  
    
      
  
      // Устанавливаем accessToken в куки
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000, // 1 час
        sameSite: 'Strict',
      });
  
      // Отправляем refreshToken в ответе
      res.json({ refreshToken, });
    } catch (error) {
      console.error('Ошибка при логине:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };
  



exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(403).json({ message: "Refresh token required" });

        const existingToken = await Token.findOne({ token: refreshToken });
        if (!existingToken) return res.status(403).json({ message: "Invalid refresh token" });

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(403).json({ message: "User not found" });

        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        existingToken.token = newRefreshToken;
        await existingToken.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.logout = async (req, res) => {
  try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
          return res.status(400).json({ message: 'Refresh token is required' });
      }

      // Удаление refreshToken из базы данных
      await Token.findOneAndDelete({ token: refreshToken });

      // Удаление accessToken из куков
      res.clearCookie('accessToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
      });

      res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
      console.error('Ошибка при логауте:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
};
