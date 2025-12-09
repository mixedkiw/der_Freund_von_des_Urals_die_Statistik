const { sequelize } = require('./connection');
const { User, Question, Answer } = require('../models');

const initDB = async () => {
  try {
    console.log('🔄 Синхронизация моделей с базой данных...');
    
    await sequelize.sync({ alter: false });
    
    console.log('✅ База данных синхронизирована успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка при синхронизации БД:', error);
    return false;
  }
};

module.exports = { initDB };
