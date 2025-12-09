const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
require('dotenv').config();
const swaggerDocument = require('./swagger.json');

const app = express();

// CORS конфигурация
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем документацию Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Простой роут для проверки статуса сервера
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Сервер работает корректно!',
    timestamp: new Date().toISOString()
  });
});

// Импортируем маршруты для API
const apiRouter = require('./routes/api');

// Подключаем маршруты к приложению
app.use('/api', apiRouter);

// Обработка 404 ошибок
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Обработка общих ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = app;
