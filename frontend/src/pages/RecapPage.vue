<template>
  <div class="recap-container">
    <!-- Прогресс бар из 8 капсул -->
    <div class="progress-bar">
      <div 
        v-for="(item, index) in totalPages" 
        :key="index"
        class="progress-item"
        :class="{ active: index < currentPage }"
      ></div>
    </div>

    <!-- Контент страницы 1 -->
    <div v-if="currentPage === 1" class="page-content">
      <h2 class="page-title">За всё время нашего знакомства мы провели</h2>
      
      <div class="stat-block">
        <div class="stat-value">{{ totalHours }} ЧАСОВ</div>
      </div>

      <div class="page-description">
        <p>учась, развлекаясь и отправляясь в походы</p>
      </div>

      <div class="page-subtitle">
        <p>некоторые на учебе появляются меньше...</p>
      </div>

      <button class="next-button" @click="goToNextPage">
        Окак, прикольно
      </button>
    </div>

    <!-- Плейсхолдеры для остальных страниц -->
    <div v-else class="page-content">
      <h2 class="page-title">Страница {{ currentPage }}</h2>
      <p>Контент страницы {{ currentPage }} будет добавлен позже</p>
      
      <button class="next-button" @click="goToNextPage">
        Дальше →
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecapPage',
  data() {
    return {
      currentPage: 1,
      totalPages: 8,
      totalHours: 256, // Это значение можно получить из БД или props
      verificationStatus: null,
      userName: null
    };
  },
  mounted() {
    // Получаем данные из localStorage
    this.verificationStatus = localStorage.getItem('verificationStatus');
    const data = localStorage.getItem('verificationData');
    if (data) {
      const parsedData = JSON.parse(data);
      this.userName = parsedData.data?.userName || null;
    }

    // Логируем информацию
    console.log('\n🎉 ========== СТРАНИЦА ИТОГОВ ==========');
    console.log('📊 Текущая страница:', this.currentPage);
    console.log('📊 Всего страниц:', this.totalPages);
    console.log('✅ Статус проверки:', this.verificationStatus);
    console.log('👤 Имя пользователя:', this.userName);
    console.log('⏰ Всего часов:', this.totalHours);
  },
  methods: {
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        console.log(`➡️ Переход на страницу ${this.currentPage}`);
        window.scrollTo(0, 0);
      } else {
        console.log('🎯 Достигнута последняя страница');
        // Можно добавить логику для завершения
      }
    }
  }
};
</script>

<style scoped>
.recap-container {
  min-height: 100vh;
  background: #00926E;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  font-family: 'Muller', sans-serif;
  max-width: 402px;
  margin: 0 auto;
  gap: 35px;
}

/* ========== ПРОГРЕСС БАР ========== */
.progress-bar {
  width: 100%;
  padding: 14px 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.progress-item {
  width: 35px;
  height: 7px;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
  background: transparent;
  transition: all 0.3s ease;
}

.progress-item.active {
  background: #D9D9D9;
  border-color: #D9D9D9;
}

/* ========== КОНТЕНТ СТРАНИЦЫ ========== */
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
  width: 100%;
}

.page-title {
  color: white;
  font-size: 28px;
  font-weight: 300;
  line-height: 29px;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  max-width: 258px;
}

/* ========== СТАТИСТИКА ========== */
.stat-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 128px;
  align-self: stretch;
}

.stat-value {
  color: white;
  font-size: 56px;
  font-family: 'Dobryak', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.4px;
  text-align: center;
  word-wrap: break-word;
  max-width: 258px;
}

/* ========== ОПИСАНИЕ ========== */
.page-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 128px;
  align-self: stretch;
}

.page-description p {
  color: white;
  font-size: 28px;
  font-weight: 300;
  line-height: 29px;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  max-width: 258px;
}

/* ========== ПОДЗАГОЛОВОК ========== */
.page-subtitle {
  text-align: center;
  max-width: 258px;
}

.page-subtitle p {
  color: white;
  font-size: 28px;
  font-weight: 300;
  line-height: 29px;
  letter-spacing: 0.4px;
  opacity: 0.5;
  margin: 0;
  word-wrap: break-word;
}

/* ========== КНОПКА ========== */
.next-button {
  padding: 13px 49px;
  background: white;
  border: none;
  border-radius: 20px;
  color: #00926E;
  font-size: 20px;
  font-family: 'Muller', sans-serif;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.4px;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
  text-align: center;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.next-button:active {
  transform: translateY(0);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.09);
}
</style>
