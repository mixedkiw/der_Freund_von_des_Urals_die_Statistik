const User = require('./User');
const Question = require('./Question');
const Answer = require('./Answer');

// Установка связей между моделями
User.hasMany(Question, { foreignKey: 'u_id', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'u_id', as: 'user' });

User.hasMany(Answer, { foreignKey: 'user_id', as: 'answers' });
Answer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

module.exports = {
  User,
  Question,
  Answer,
};
