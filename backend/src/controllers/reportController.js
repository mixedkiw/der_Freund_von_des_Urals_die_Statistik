const { User, Question, Answer } = require('../models');

// GET /api/get-report - получение отчёта в CSV формате
const getReport = async (req, res) => {
  try {
    // Получаем всех пользователей с их ответами
    const users = await User.findAll({
      include: [
        {
          model: Question,
          as: 'questions',
          include: [
            {
              model: Answer,
              as: 'answers',
              where: { user_id: { [require('sequelize').Op.col]: 'User.id' } },
              required: false,
            },
          ],
        },
        {
          model: Answer,
          as: 'answers',
        },
      ],
    });

    // Формируем CSV данные
    let csvContent = 'ID,Имя,Вопрос,Ответ\n';

    users.forEach((user) => {
      const answers = user.answers || [];

      if (answers.length === 0) {
        // Если нет ответов, просто добавляем пользователя
        csvContent += `${user.id},"${user.name.replace(/"/g, '""')}","","".\n`;
      } else {
        answers.forEach((answer, index) => {
          const question = answer.question || {};
          const questionName = question.name || `Вопрос ${index + 1}`;

          csvContent += `${user.id},"${user.name.replace(/"/g, '""')}","${questionName.replace(/"/g, '""')}","${(answer.description || '').replace(/"/g, '""')}"\n`;
        });
      }
    });

    // Установляем заголовки для скачивания
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');

    res.send('\uFEFF' + csvContent); // \uFEFF - BOM для правильного отображения UTF-8 в Excel
  } catch (error) {
    console.error('Ошибка при генерации отчёта:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при генерации отчёта',
      details: error.message,
    });
  }
};

module.exports = {
  getReport,
};
