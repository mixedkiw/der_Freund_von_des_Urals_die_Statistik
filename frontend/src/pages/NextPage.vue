<template>
  <div class="next-page-container">
    <div class="content">
      <h1>🎉 Следующая страница</h1>
      
      <div v-if="verificationStatus" class="info">
        <p><strong>Статус проверки:</strong> {{ verificationStatus }}</p>
        <p v-if="verificationData"><strong>Данные:</strong> {{ JSON.stringify(verificationData, null, 2) }}</p>
      </div>

      <button @click="goBack" class="back-button">
        ← Вернуться на главную
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NextPage',
  data() {
    return {
      verificationStatus: null,
      verificationData: null
    };
  },
  mounted() {
    this.verificationStatus = localStorage.getItem('verificationStatus');
    const data = localStorage.getItem('verificationData');
    if (data) {
      this.verificationData = JSON.parse(data);
    }
  },
  methods: {
    goBack() {
      localStorage.removeItem('verificationStatus');
      localStorage.removeItem('verificationData');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.next-page-container {
  min-height: 100vh;
  background: #00926E;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  font-family: 'Muller', sans-serif;
}

.content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

h1 {
  color: #00926E;
  margin-bottom: 30px;
}

.info {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: left;
}

.info p {
  margin: 10px 0;
  word-break: break-all;
}

.back-button {
  padding: 13px 49px;
  background: #00926E;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 18px;
  font-family: 'Muller', sans-serif;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.back-button:active {
  transform: translateY(0);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.09);
}
</style>
