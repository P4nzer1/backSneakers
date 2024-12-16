const multer = require('multer');
const path = require('path');

// Конфигурация хранилища файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Путь для сохранения изображений
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
  }
});

// Фильтр для проверки типа файла (только изображения)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Допускаются только изображения'), false);
  }
};

// Настройка multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
