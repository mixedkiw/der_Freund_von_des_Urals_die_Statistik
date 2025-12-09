const { Sequelize } = require('sequelize');
const path = require('path');

// Настройка подключения к SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false, // Отключаем логирование SQL запросов (можно включить для отладки)
});

// Функция для проверки подключения
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  connectDB,
};
