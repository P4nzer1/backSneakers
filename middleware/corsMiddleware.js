const cors = require('cors');


const allowedOrigins = ['https://trusteddomain.com', 'https://anothertrusteddomain.com', 'http://localhost:6000','http://localhost:5000','http://localhost:3000', ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Разрешить запрос
    } else {
      callback(new Error('Not allowed by CORS')); // Запретить запрос
    }
  },
  credentials: true, // Разрешить отправку cookies
};

module.exports = cors(corsOptions);
