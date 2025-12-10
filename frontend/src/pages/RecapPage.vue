<template>
  <div class="recap-container">
    <!-- Прогресс бар (скрыт на последней странице и предпоследней) -->
    <div v-if="showProgressBar" class="progress-bar" :class="{ 'all-complete': currentPage === 9 }">
      <div 
        v-for="(item, index) in progressBarPages" 
        :key="index"
        class="progress-item"
        :class="{ active: index < availablePages.indexOf(currentPage), 'all-active': currentPage === 9 }"
      ></div>
    </div>

    <!-- Страница 1: За всё время мы провели -->
    <div v-if="currentPage === 1" class="page-content">
      <h2 class="page-title fade-in-1">За всё время нашего знакомства мы провели</h2>
      
      <div class="stat-block fade-in-2">
        <div class="stat-value">256 ЧАСОВ</div>
      </div>

      <div class="page-description fade-in-3">
        <p>учась, развлекаясь и отправляясь в походы</p>
      </div>

      <div class="page-subtitle fade-in-4">
        <p>некоторые на учебе появляются меньше...</p>
      </div>

      <button class="next-button fade-in-5" @click="goToNextPage">
        Окак, прикольно
      </button>
    </div>

    <!-- Страница 2: Учились и культурились -->
    <div v-if="currentPage === 2" class="page-content">
      <div class="stat-pair fade-in-1">
        <div class="stat-title">А учились мы</div>
        <div class="stat-value-large">X ЧАСОВ,</div>
      </div>

      <div class="stat-pair fade-in-2">
        <div class="stat-title">А культурились мы</div>
        <div class="stat-value-large">X ЧАСОВ,</div>
      </div>

      <div class="stat-pair fade-in-3">
        <div class="stat-title">А полезной программой мы были заняты</div>
        <div class="stat-value-large">X ЧАСОВ</div>
      </div>

      <button class="next-button fade-in-4" @click="goToNextPage">
        Вау, целая жизнь!
      </button>
    </div>

    <!-- Страница 3: Люди и спикеры -->
    <div v-if="currentPage === 3" class="page-content">
      <div class="stat-pair fade-in-1">
        <div class="stat-title">У нас еще было вот столько</div>
        <div class="stat-value-large">X ЛЮДЕЙ,</div>
      </div>

      <div class="stat-pair fade-in-2">
        <div class="stat-title">федеральных спикеров и вот столько</div>
        <div class="stat-value-large">X ЛЮДЕЙ,</div>
      </div>

      <div class="stat-pair fade-in-3">
        <div class="stat-title">региональных<br><br>Ну что, какой самый важный урок был извлечён?</div>
      </div>

      <button class="next-button fade-in-4" @click="goToNextPage">
        Я вслух не буду говорить
      </button>
    </div>

    <!-- Страница 4: Заявку подавали и дошли -->
    <div v-if="currentPage === 4" class="page-content">
      <div class="stat-pair fade-in-1">
        <div class="stat-title">А ведь когда-то заявку подавали</div>
        <div class="stat-value-large">X ЛЮДЕЙ,</div>
      </div>

      <div class="stat-pair fade-in-2">
        <div class="stat-title">из кого дошли с тобой до конца только</div>
        <div class="stat-value-large">X ЛЮДЕЙ,</div>
      </div>

      <div class="stat-pair fade-in-3">
        <div class="stat-title">а в том числе</div>
        <div class="stat-value-large">X ЛЮДЕЙ,</div>
      </div>

      <div class="stat-pair fade-in-4">
        <div class="stat-title">организаторов</div>
      </div>

      <button class="next-button fade-in-5" @click="goToNextPage">
        Цифры... много цифр
      </button>
    </div>

    <!-- Страница 5: Люди которые мотивировали -->
    <div v-if="currentPage === 5 && isUserFound" class="page-content">
      <div class="long-title fade-in-1">Среди всех этих людей нашлись те, кто тебя мотивировал:</div>
      
      <div class="stat-value-large stat-value-large-51 fade-in-2">ЗДЕСЬ СПИСОК ЛЮДЕЙ</div>

      <div class="long-text fade-in-3">не забудь сказать спасибо каждому, кто тебя поддержал. Ладненько?</div>

      <button class="next-button fade-in-4" @click="goToNextPage">
        Ладненько
      </button>
    </div>

    <!-- Страница 6: Целых 10 команд -->
    <div v-if="currentPage === 6 && isUserFound" class="page-content">
      <div class="stat-pair fade-in-1">
        <div class="stat-title">А еще было целых</div>
        <div class="stat-value-large stat-value-large-51">10 КОМАНД</div>
      </div>

      <div class="page-description fade-in-2">
        <p>каждая из которых была лучшей и командой мечты</p>
      </div>

      <div class="page-description fade-in-3">
        <p>забавно, не правда ли?</p>
      </div>

      <div class="page-description fade-in-4">
        <p>сколько же личных историй у нас случилось в командах за всё это время...</p>
      </div>

      <button class="next-button fade-in-5" @click="goToNextPage">
        А каково наставникам?...
      </button>
    </div>

    <!-- Страница 7: Девиз -->
    <div v-if="currentPage === 7 && isUserFound" class="page-content">
      <div class="stat-title fade-in-1">И все это было тобой пройдено под девизом</div>
      
      <div class="stat-value-large stat-value-large-51 fade-in-2">
        "ЗДЕСЬ ДЕВИЗ"
      </div>

      <div class="page-description fade-in-3">
        <p>- великолепные слова :)</p>
      </div>

      <button class="next-button fade-in-4" @click="goToNextPage">
        Спасибо, знаю
      </button>
    </div>

    <!-- Страница 8: Самое запомнилось -->
    <div v-if="currentPage === 8 && isUserFound" class="page-content">
      <div class="stat-title fade-in-1">Причем больше всего тебе запомнилось</div>
      
      <div class="stat-value-large stat-value-large-51 fade-in-2">ЗДЕСЬ НАЗВАНИЕ МЕРОПРИЯТИЯ</div>

      <div class="page-description fade-in-3">
        <p>хмм... кажется, у тебя великолепный вкус. И, кажется, как минимум один закрытый гештальт</p>
      </div>

      <button class="next-button fade-in-4" @click="goToNextPage">
        Какая милота
      </button>
    </div>

    <!-- Страница 9: Не прощаемся, начинаем новую историю -->
    <div v-if="currentPage === 9" class="page-content">
      <div class="logo-block fade-in-1">
        <img :src="logoImage" class="logo-image" alt="Logo" />
      </div>

      <div class="page-description fade-in-2">
        <p>Мы не прощаемся. Мы просто начинаем новую историю</p>
      </div>

      <button class="next-button fade-in-3" @click="goToNextPage">
        Даю зелёный свет
      </button>
    </div>

    <!-- Страница 10: Финальная -->
    <div v-if="currentPage === 10" class="page-content page-content-final">
      <div class="logo-block fade-in-1">
        <img :src="logoImage" class="logo-image" alt="Logo" />
      </div>

      <div class="page-description final-text fade-in-2">
        <p>Ты теперь не совсем тот человек, которого мы встретили в начале года на программе. Кажется, теперь ты друг с Юга Урала и...</p>
      </div>

      <div class="stat-value-large stat-value-large-51 fade-in-3">
        ЗДЕСЬ ПРО "КТО Я"
      </div>

      <button class="next-button fade-in-4" @click="finishRecap">
        Именно так
      </button>
    </div>
  </div>
</template>

<script>
import logoImage from '../assets/logo.png'

export default {
  name: 'RecapPage',
  data() {
    return {
      currentPage: 1,
      totalPages: 10,
      maxProgressPages: 9,
      totalHours: 256,
      verificationStatus: null,
      userName: null,
      logoImage: logoImage,
      isUserFound: true
    };
  },
  computed: {
    // Вычисляем количество страниц на основе статуса верификации
    availablePages() {
      // Если пользователь найден (200) - все 10 страниц
      if (this.isUserFound) {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
      // Если не найден (404) - только 1, 2, 3, 4, 9, 10
      return [1, 2, 3, 4, 9, 10];
    },
    // Количество прямоугольников в прогресс-баре
    progressBarPages() {
      if (this.isUserFound) {
        return 9; // 9 прямоугольников для 10 страниц (на 10-й нет бара)
      }
      return 4; // 4 прямоугольника для страниц 1-4
    },
    // Показываем ли прогресс-бар
    showProgressBar() {
      return this.currentPage !== 10 && this.currentPage !== 9;
    }
  },
  mounted() {
    // Получаем данные из localStorage
    this.verificationStatus = localStorage.getItem('verificationStatus');
    const data = localStorage.getItem('verificationData');
    if (data) {
      const parsedData = JSON.parse(data);
      this.userName = parsedData.data?.userName || null;
    }

    // Определяем найден ли пользователь (200 = найден, 404 = не найден)
    this.isUserFound = this.verificationStatus === '200';

    // Логируем информацию
    console.log('\n🎉 ========== СТРАНИЦА ИТОГОВ ==========');
    console.log('📊 Текущая страница:', this.currentPage);
    console.log('📊 Доступные страницы:', this.availablePages);
    console.log('📊 Прямоугольников в баре:', this.progressBarPages);
    console.log('✅ Статус проверки:', this.verificationStatus);
    console.log('✅ Пользователь найден:', this.isUserFound);
    console.log('👤 Имя пользователя:', this.userName);
    console.log('⏰ Всего часов:', this.totalHours);
  },
  methods: {
    goToNextPage() {
      let nextPageIndex = this.availablePages.indexOf(this.currentPage) + 1;
      
      if (nextPageIndex < this.availablePages.length) {
        this.currentPage = this.availablePages[nextPageIndex];
        console.log(`➡️ Переход на страницу ${this.currentPage}`);
        window.scrollTo(0, 0);
      } else {
        console.log('🎯 Достигнута последняя доступная страница');
      }
    },
    finishRecap() {
      console.log('🎯 Завершение просмотра итогов');
      localStorage.removeItem('verificationStatus');
      localStorage.removeItem('verificationData');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* ========== ПОДКЛЮЧЕНИЕ ШРИФТОВ ========== */
@font-face {
  font-family: 'Dobryak';
  src: url('@/assets/Dobryak_font.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'MullerLight';
  src: url('@/assets/Fontfabric - MullerLight.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
}

/* ========== АНИМАЦИИ ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-1 {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.fade-in-2 {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.fade-in-3 {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.fade-in-4 {
  animation: fadeInUp 0.6s ease-out 0.7s both;
}

.fade-in-5 {
  animation: fadeInUp 0.6s ease-out 0.9s both;
}

/* ========== ОСНОВНОЙ КОНТЕЙНЕР ========== */
.recap-container {
  min-height: 100vh;
  background: #00926E;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  font-family: 'MullerLight', 'Muller', sans-serif;
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
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.progress-bar::-webkit-scrollbar {
  height: 0;
}

.progress-item {
  width: 35px;
  height: 7px;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
  background: transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.progress-item.active {
  background: #D9D9D9;
  border-color: #D9D9D9;
}

.progress-item.all-active {
  background: #D9D9D9;
  border-color: #D9D9D9;
}

/* ========== КОНТЕНТ СТРАНИЦЫ ========== */
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 45px;
  width: 100%;
  padding: 20px 0;
  min-height: auto;
}

.page-content-final {
  justify-content: center;
  min-height: calc(100vh - 50px);
}

.page-title {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  max-width: 320px;
  font-family: 'MullerLight', 'Muller', sans-serif;
}

/* ========== СТАТИСТИКА - ПАРЫ ========== */
.stat-pair {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

.stat-title {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  max-width: 320px;
  font-family: 'MullerLight', 'Muller', sans-serif;
}

/* ========== СТАТИСТИКА - ЗНАЧЕНИЯ ========== */
.stat-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  height: auto;
  align-self: stretch;
}

.stat-value {
  color: white;
  font-size: 56px;
  font-family: 'Dobryak', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 78px;
  letter-spacing: 0.4px;
  text-align: center;
  word-wrap: break-word;
  max-width: 350px;
  width: 100%;
}

.stat-value-large {
  color: white;
  font-size: 56px;
  font-family: 'Dobryak', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 78px;
  letter-spacing: 0.4px;
  text-align: center;
  word-wrap: break-word;
  max-width: 350px;
  width: 100%;
}

.stat-value-large-51 {
  font-size: 51px;
  font-family: 'Dobryak', 'Arial', sans-serif;
  line-height: 75px;
  max-width: 350px;
  width: 100%;
}

/* ========== ОПИСАНИЕ ========== */
.page-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  min-height: auto;
  align-self: stretch;
}

.page-description p {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  max-width: 320px;
  font-family: 'MullerLight', 'Muller', sans-serif;
}

.page-description.final-text p {
  font-size: 24px;
  line-height: 26px;
  max-width: 320px;
}

/* ========== ПОДЗАГОЛОВОК ========== */
.page-subtitle {
  text-align: center;
  max-width: 320px;
}

.page-subtitle p {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0.4px;
  opacity: 0.5;
  margin: 0;
  word-wrap: break-word;
  font-family: 'MullerLight', 'Muller', sans-serif;
}

/* ========== ДЛИННЫЙ ТЕКСТ ========== */
.long-title {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0.4px;
  text-align: center;
  max-width: 320px;
  word-wrap: break-word;
  margin: 0;
  font-family: 'MullerLight', 'Muller', sans-serif;
}

.long-text {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0.4px;
  text-align: center;
  max-width: 320px;
  word-wrap: break-word;
  font-family: 'MullerLight', 'Muller', sans-serif;
}

/* ========== ЛОГОТИП ========== */
.logo-block {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  width: 175px;
  height: 175px;
  padding: 10px;
  border-radius: 8px;
  object-fit: contain;
}

/* ========== КНОПКА ========== */
.next-button {
  padding: 13px 49px;
  background: white;
  border: none;
  border-radius: 20px;
  color: #00926E;
  font-size: 20px;
  font-family: 'MullerLight', 'Muller', sans-serif;
  font-weight: 300;
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

/* ========== АДАПТИВНОСТЬ ========== */
@media (max-width: 480px) {
  .recap-container {
    padding: 15px;
    gap: 25px;
  }

  .progress-bar {
    padding: 10px 10px;
    gap: 8px;
  }

  .progress-item {
    width: 30px;
    height: 6px;
  }

  .page-title,
  .stat-title,
  .long-title,
  .long-text {
    font-size: 24px;
    line-height: 26px;
  }

  .stat-value,
  .stat-value-large {
    font-size: 48px;
    line-height: 44px;
  }

  .stat-value-large-51 {
    font-size: 44px;
    line-height: 44px;
  }

  .page-description p {
    font-size: 24px;
    line-height: 26px;
  }

  .next-button {
    font-size: 18px;
    padding: 10px 40px;
  }
}
</style>
