const app = require('./app');
const { connectDB } = require('./database/connection');
const { initDB } = require('./database/init');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Функция запуска сервера
const startServer = async () => {
  try {
    // Подключаемся к БД
    const connected = await connectDB();
    if (!connected) {
      throw new Error('Не удалось подключиться к БД');
    }

    // Инициализируем БД (создаём таблицы)
    const initialized = await initDB();
    if (!initialized) {
      throw new Error('Не удалось инициализировать БД');
    }

  // Запускаем сервер (слушаем на всех интерфейсах внутри контейнера)
  app.listen(PORT, HOST, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Express.js API Server успешно запущен ║
╚════════════════════════════════════════╝

🚀 Сервер запущен на: http://${HOST}:${PORT}
📚 Swagger UI доступен на: http://${HOST}:${PORT}/api-docs
✅ API статус: http://${HOST}:${PORT}/api/status

🗄️  База данных: SQLite (database.sqlite)

Доступные endpoints:
  GET  /api/status           - Проверка статуса сервера
  POST /api/save             - Сохранение ответов
  GET  /api/get-report       - Получение отчёта (CSV)
  POST /api/verify-name      - Проверка имени в БД
  
      `);
    });
  } catch (error) {
    console.error('❌ Ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

startServer();

