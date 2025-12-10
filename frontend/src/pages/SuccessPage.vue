<template>
  <div class="success-container">
    <!-- Логотип -->
    <img src="../assets/logo.png" alt="Логотип Друг С ЮгаУрала" class="logo"/>
    
    <!-- До времени показываем заглушку -->
    <div v-if="!isTimeReached" class="placeholder-content">
      <div class="placeholder-block">
        <h2 class="placeholder-text">
          Что-то ищешь здесь,
          <span class="italic">друг</span> с Юга Урала?
        </h2>
      </div>

      <div class="placeholder-block">
        <h2 class="placeholder-text">
          Кажется, придётся немного (чуть-чуть)
          <span class="italic">подождать</span>
        </h2>
      </div>

      <div class="placeholder-block">
        <h2 class="placeholder-text">Хехе :)</h2>
      </div>
    </div>

    <!-- После времени показываем форму -->
    <div v-else class="form-content">
      <h1 class="form-title">Добро пожаловать!</h1>
      
      <div class="form-input-wrapper">
        <CustomInput 
          placeholder="Введи сюда имя и фамилию"
          label="Как тебя зовут, <b>друг</b> с Юга Урала?"
          :value="userName"
          @input="userName = $event"
        />
      </div>

      <button 
        @click="handleNameSubmit"
        :disabled="isLoading"
        class="form-button"
      >
        {{ isLoading ? 'Проверка...' : 'Так меня зовут' }}
      </button>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import CustomInput from '../components/CustomInput.vue';

export default {
  name: 'SuccessPage',
  components: {
    CustomInput
  },
  data() {
    return {
      isTimeReached: false,
      userName: '',
      isLoading: false,
      message: '',
      messageType: '', // 'success' или 'error'
      // ⚠️ ЗДЕСЬ МЕНЯЙ ДАТУ И ВРЕМЯ ДЛЯ ТЕСТИРОВАНИЯ
      // Формат: 'YYYY-MM-DD HH:mm:ss'
      // Временная зона: Asia/Yekaterinburg (UTC+5)
      // ПРОДАКШН ДАТА: '2025-12-11 21:21:00'
      // ТЕКУЩЕЕ ВРЕМЯ В EKATERINBURG: 2025-12-10 01:45:46
      activationDateTime: '2025-12-10 8:00:00',
      timezone: 'Asia/Yekaterinburg'
    };
  },
  mounted() {
    this.checkTime();
  },
  methods: {
    checkTime() {
      try {
        // Парсим время активации
        const [datePart, timePart] = this.activationDateTime.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        // Создаём дату в указанной временной зоне
        // Для Yekaterinburg (UTC+5) нужно учесть смещение
        const activationTime = new Date(year, month - 1, day, hours, minutes, seconds);
        
        // Получаем текущее время с учётом Yekaterinburg
        const now = new Date();
        const offset = 5 * 60 * 60 * 1000; // UTC+5 в миллисекундах
        const yekTime = new Date(now.getTime() + offset);

        this.isTimeReached = yekTime >= activationTime;
        
        console.log(`🕐 Время активации: ${activationTime.toLocaleString()}`);
        console.log(`🕐 Текущее время (Yekaterinburg): ${yekTime.toLocaleString()}`);
        console.log(`✅ Активировано: ${this.isTimeReached}`);
      } catch (error) {
        console.error('Ошибка при проверке времени:', error);
      }
    },
    async handleNameSubmit() {
      try {
        if (!this.userName || !this.userName.trim()) {
          this.message = 'Пожалуйста, введите ваше имя';
          this.messageType = 'error';
          console.log('❌ Имя не введено');
          return;
        }

        this.isLoading = true;
        this.message = '';

        const nameToSend = this.userName.trim();
        console.log('📤 Отправляю запрос на проверку имени:');
        console.log('   Имя:', nameToSend);
        console.log('   URL:', `${import.meta.env.VITE_API_URL}/verify-name`);

        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/verify-name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: nameToSend
          }),
        });

        const data = await response.json();

        console.log('✅ Получен ответ от сервера:');
        console.log('   Статус:', response.status);
        console.log('   Данные:', data);

        // Сохраняем статус код в localStorage для следующей страницы
        localStorage.setItem('verificationStatus', response.status);
        localStorage.setItem('verificationData', JSON.stringify(data));

        // В любом случае перенаправляем на /next-page
        console.log('➡️ Перенаправляю на /next-page со статусом:', response.status);
        setTimeout(() => {
          this.$router.push('/next-page');
        }, 500);

      } catch (error) {
        console.error('❌ Ошибка при проверке имени:', error);
        this.message = `❌ Ошибка подключения: ${error.message}`;
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.success-container {
  min-height: 100vh;
  background: #00926E;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  font-family: 'Muller', sans-serif;
  max-width: 402px;
  margin: 0 auto;
}

/* Логотип */
.logo {
  width: 175px;
  height: 175px;
  padding: 10px;
  display: block;
  object-fit: contain;
  margin-bottom: 20px;
}

/* ========== ЗАГЛУШКА (ДО ВРЕМЕНИ) ========== */
.placeholder-content {
  display: flex;
  flex-direction: column;
  gap: 35px;
  width: 100%;
  align-items: center;
}

.placeholder-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.placeholder-text {
  color: white;
  font-size: 29px;
  font-weight: 300;
  line-height: 29px;
  letter-spacing: 0.4px;
  margin: 0;
  word-wrap: break-word;
}

.placeholder-text .italic {
  font-style: italic;
  font-weight: 400;
}

/* ========== ФОРМА (ПОСЛЕ ВРЕМЕНИ) ========== */
.form-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  margin-top: 20px;
}

.form-title {
  color: white;
  font-size: 29px;
  font-weight: 300;
  line-height: 29px;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  word-wrap: break-word;
}

.form-input-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-button {
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
  line-height: 16px;
}

.form-button:hover {
  background-color: #f5f5f5;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.form-button:active {
  background-color: #e8e8e8;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.09);
  transform: translateY(0px);
}

.form-button:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
  opacity: 0.6;
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
