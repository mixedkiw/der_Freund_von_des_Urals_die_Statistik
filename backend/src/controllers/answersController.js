const { User, Question, Answer } = require('../models');

// POST /api/save - сохранение ответов пользователя
const saveAnswers = async (req, res) => {
  try {
    const { name, answers } = req.body;

    console.log('\n💾 ========== СОХРАНЕНИЕ ОТВЕТОВ ==========');
    console.log('📥 Получены данные:');
    console.log('   Имя:', name);
    console.log('   Кол-во ответов:', answers ? answers.length : 0);

    // Валидация
    if (!name || !name.trim()) {
      console.log('❌ Ошибка: имя пусто');
      return res.status(400).json({
        success: false,
        error: 'Имя пользователя обязательно',
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      console.log('❌ Ошибка: ответы пусты');
      return res.status(400).json({
        success: false,
        error: 'Ответы обязательны',
      });
    }

    // Создаём пользователя
    console.log('👤 Создаю пользователя с именем:', name.trim());
    const user = await User.create({
      name: name.trim(),
    });
    console.log('✅ Пользователь создан, ID:', user.id);

    // Создаём вопросы и ответы
    for (let i = 0; i < answers.length; i++) {
      const { question, answer } = answers[i];

      // Создаём вопрос
      const questionRecord = await Question.create({
        u_id: user.id,
        name: question || `Вопрос ${i + 1}`,
        description: null,
      });
      console.log(`   ✅ Вопрос ${i + 1} создан, ID: ${questionRecord.id}`);

      // Создаём ответ
      if (answer && answer.trim()) {
        await Answer.create({
          user_id: user.id,
          question_id: questionRecord.id,
          description: answer.trim(),
        });
        console.log(`      ✅ Ответ сохранён`);
      }
    }

    console.log('✅ Все данные успешно сохранены, возвращаю ответ');
    res.status(201).json({
      success: true,
      message: 'Ответы успешно сохранены',
      data: {
        userId: user.id,
        userName: user.name,
        answersCount: answers.length,
      },
    });
  } catch (error) {
    console.error('Ошибка при сохранении ответов:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при сохранении ответов',
      details: error.message,
    });
  }
};

module.exports = {
  saveAnswers,
};
