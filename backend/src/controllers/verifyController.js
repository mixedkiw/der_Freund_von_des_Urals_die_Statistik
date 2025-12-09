const { User } = require('../models');

/**
 * Проверяет наличие пользователя по имени
 */
const verifyName = async (req, res) => {
  try {
    const { name } = req.body;

    console.log('\n🔍 ========== ПРОВЕРКА ИМЕНИ ==========');
    console.log('📥 Получен запрос на /verify-name');
    console.log('📦 Тело запроса:', req.body);
    console.log('   name:', name);
    console.log('   name type:', typeof name);
    console.log('   name length:', name ? name.length : 'null');

    // Валидация
    if (!name || !name.trim()) {
      console.log('❌ Ошибка: имя пусто');
      return res.status(400).json({
        success: false,
        message: 'Имя не может быть пустым'
      });
    }

    const trimmedName = name.trim();
    console.log('✂️  После trim():', trimmedName);
    console.log('   Ищу пользователя в БД с именем:', trimmedName);

    // Ищем пользователя в БД
    const user = await User.findOne({
      where: { name: trimmedName }
    });

    console.log('🔎 Результат поиска в БД:');
    if (user) {
      console.log('✅ НАЙДЕН пользователь:');
      console.log('   ID:', user.id);
      console.log('   Имя:', user.name);
      console.log('   Возвращаю статус 200');
      
      return res.status(200).json({
        success: true,
        message: 'Пользователь найден',
        data: {
          userId: user.id,
          userName: user.name
        }
      });
    } else {
      console.log('❌ НЕ НАЙДЕН пользователь');
      console.log('   Все пользователи в БД:');
      const allUsers = await User.findAll();
      allUsers.forEach(u => {
        console.log(`   - ID: ${u.id}, Имя: "${u.name}"`);
      });
      console.log('   Возвращаю статус 404');
      
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        data: null
      });
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке имени:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера',
      error: error.message
    });
  }
};

module.exports = { verifyName };
