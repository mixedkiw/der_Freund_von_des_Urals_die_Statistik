<template>
  <div>
    <!-- Форма с вопросами -->
    <div v-if="!showSuccess" class="questions-page">
      <img src="../assets/logo.png" alt="Логотип Друг С ЮгаУрала"/>
      <div class="questions-block" v-for="(el, index) in array_questions" :key="index">
        <div class="questions-cont">
          <CustomInput 
            ref="inputs"
            :placeholder="array_placeholders[index]" 
            :label="el"
            @input="updateAnswer(index, $event)"
          />
        </div>
      </div>
      <button 
        @click="submitAnswers"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Отправка...' : 'Отправить ответы' }}
      </button>
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>

    <!-- Success Page -->
    <SuccessPage 
      v-else
      :userName="userName"
      @reset="resetForm"
    />
  </div>
</template>

<script>
  import CustomInput from '../components/CustomInput.vue';
  import SuccessPage from './SuccessPage.vue';

export default {
  name: 'QuestionsPage',
  components: { 
    CustomInput,
    SuccessPage
  },
  data() {
    return {
      array_questions: [
        "Как тебя зовут, <b><i>друг</i></b> с Юга Урала?",
        "Как звучит твой <b><i>девиз</i></b>?",
        "Какое <b><i>мероприятие</i></b> тебе больше всего запомнилось за предыдущие три модуля?",
        "Кто <b><i>мотивировал</i></b> тебя на протяжении всей программы '<b>друг</b> с Юга Урала'?",
        'Кем ты стал, "<b> <i>друг </i></b> с Юга Урала?"'
      ],
      array_placeholders: [
        "Введи сюда имя и фамилию",
        "Введи сюда мотивирующие тебя строки",
        "Введи сюда название мероприятия",
        "Введи сюда имя или имена через запятую",
        "Напиши здесь, кем ты себя считаешь"
      ],
      answers: [],
      isLoading: false,
      message: '',
      messageType: '', // 'success' или 'error'
      showSuccess: false,
      userName: ''
    };
  },
  mounted() {
    // Инициализируем массив ответов
    this.answers = new Array(this.array_questions.length).fill('');
  },
  methods: {
    updateAnswer(index, value) {
      this.answers[index] = value;
    },
    async submitAnswers() {
      try {
        const name = this.answers[0];

        console.log('\n📝 ========== ОТПРАВКА ОТВЕТОВ ==========');
        console.log('📥 Имя из первого поля:', name);

        if (!name || !name.trim()) {
          this.message = 'Пожалуйста, введите ваше имя в первое поле';
          this.messageType = 'error';
          console.log('❌ Имя пусто');
          return;
        }

        this.isLoading = true;
        this.message = '';

        // Формируем данные для отправки
        const formData = {
          name: name.trim(),
          answers: this.array_questions.map((question, index) => ({
            question,
            answer: this.answers[index],
          })),
        };

        console.log('📤 Формируемые данные:');
        console.log('   Имя:', formData.name);
        console.log('   Кол-во ответов:', formData.answers.length);

        // Отправляем на backend
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log('🌐 API URL:', apiUrl);
        const response = await fetch(`${apiUrl}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log('📤 Ответ от сервера /api/save:');
        console.log('   Статус:', response.status);
        console.log('   Данные:', data);

        if (response.ok) {
          console.log('✅ Ответы успешно сохранены!');
          console.log('   userID:', data.data.userId);
          console.log('   userName:', data.data.userName);
          this.userName = data.data.userName;
          this.showSuccess = true;
          // Перенаправляем на SuccessPage через 1 сек
          setTimeout(() => {
            console.log('➡️ Перенаправляю на /success');
            this.$router.push('/success');
          }, 1000);
        } else {
          this.message = `❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`;
          this.messageType = 'error';
        }
      } catch (error) {
        console.error('Ошибка при отправке:', error);
        this.message = `❌ Ошибка подключения: ${error.message}`;
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.showSuccess = false;
      this.answers = new Array(this.array_questions.length).fill('');
      this.message = '';
      this.userName = '';
    }
  },
};
</script>

<style scoped>
/* ========== ЕДИНЫЙ РЕЗИНОВЫЙ МАКЕТ ========== */
.questions-page {
  width: 100%;
  max-width: 402px;
  margin: 0 auto;
  padding: 25px;
  background: #00926E;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 100vh;
  box-sizing: border-box;
}

.questions-page img {
  width: 175px;
  height: 175px;
  padding: 10px;
  display: block;
  object-fit: contain;
}

.questions-cont {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  font-family: 'Muller', sans-serif;
  letter-spacing: 0.40px;
  padding: 13px 49px;
  border: none;
  border-radius: 20px;
  background-color: white;
  color: #00926E;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: rgba(219, 219, 219, 0);
  line-height: 16px;
}

/* Hover состояние */
button:hover {
  background-color: #f5f5f5;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Active состояние (нажатие/tap) */
button:active {
  background-color: #e8e8e8;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.09);
  transform: translateY(0px);
}

/* Focus состояние (для клавиатуры) */
button:focus {
  outline: 2px solid #00926E;
  outline-offset: 2px;
}

/* Disabled состояние */
button:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.09);
  opacity: 0.6;
  transform: none;
}

/* ========== СООБЩЕНИЕ ========== */
.message {
  margin-top: 20px;
  padding: 12px 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-family: 'Muller', sans-serif;
  font-weight: 400;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>