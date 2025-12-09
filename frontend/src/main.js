import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Импортируем страницы
import QuestionsPage from './pages/QuestionsPage.vue'
import SuccessPage from './pages/SuccessPage.vue'
import NextPage from './pages/NextPage.vue'

// Создаём маршруты
const routes = [
  {
    path: '/',
    name: 'questions',
    component: QuestionsPage
  },
  {
    path: '/success',
    name: 'success',
    component: SuccessPage
  },
  {
    path: '/next-page',
    name: 'next-page',
    component: NextPage
  }
]

// Создаём роутер
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Создаём и монтируем приложение
createApp(App)
  .use(router)
  .mount('#app')
