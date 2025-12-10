# 🚀 БЫСТРАЯ ИНСТРУКЦИЯ: GitHub Pages + Ngrok

## Этап 1: Подготовка GitHub репозитория

### 1.1 Создание репозитория
```bash
# Замени GITHUB_USERNAME на своё имя пользователя
GITHUB_USERNAME="your_github_username"

# Создай репозиторий на https://github.com/new
# Имя: ${GITHUB_USERNAME}.github.io
# Описание: Year in Review - Friend from South Urals
# Тип: Public
# Без README, .gitignore и лицензии
```

### 1.2 Инициализация git в проекте
```bash
cd /home/kacher/Projects/Project

# Инициализируй git (если ещё не инициализирован)
git init
git config user.email "your_email@example.com"
git config user.name "Your Name"

# Добавь удалённый репозиторий
git remote add origin https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io.git

# Проверь конфигурацию
git remote -v
```

### 1.3 Загрузи проект на GitHub
```bash
# Добавь файлы
git add .

# Коммит
git commit -m "Initial commit: Year in Review application"

# Загрузи на GitHub
git branch -M main
git push -u origin main
```

### 1.4 Включи GitHub Pages

1. Перейди на https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io/settings/pages
2. В разделе "Build and deployment":
   - Source: **GitHub Actions**
   - Сохрани

GitHub Actions автоматически начнёт собирать и публиковать фронтенд при каждом push!

---

## Этап 2: Установка Ngrok на сервер

### 2.1 Установи Ngrok
```bash
# На сервере (144.31.68.248)
ssh -p 1124 root@144.31.68.248

# Загрузи Ngrok (для Linux ARM64)
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip
unzip ngrok-v3-stable-linux-amd64.zip
sudo mv ngrok /usr/local/bin/

# Проверь установку
ngrok version
```

### 2.2 Запусти Ngrok туннель на API
```bash
# На сервере
ngrok http 3000 --region eu  # eu для европейского региона

# Ты увидишь примерно такое:
# Session Status                online
# Account                       (Бесплатный аккаунт)
# Version                       3.3.0
# Region                        Europe (eu)
# Latency                       25ms
# Web Interface                 http://127.0.0.1:4040
# Forwarding                    https://abcd-1234-5678-9012.eu.ngrok.io -> http://localhost:3000
# ^^ СКОПИРУЙ ЭТО ЗНАЧЕНИЕ ^^
```

### 2.3 Сохрани Ngrok URL
```bash
# Ngrok URL (меняется при перезапуске):
# https://abcd-1234-5678-9012.eu.ngrok.io

# Этот URL будет твоим API адресом вместо IP сервера!
```

---

## Этап 3: Обновление API URL во фронтенде

### 3.1 Обнови .env файлы
```bash
cd /home/kacher/Projects/Project/frontend

# Редактируй .env.production.local
# Замени на реальный Ngrok URL
echo 'VITE_API_URL=https://abcd-1234-5678-9012.eu.ngrok.io/api' > .env.production.local
```

### 3.2 Собери и загрузи на GitHub
```bash
cd /home/kacher/Projects/Project

# Собери фронтенд
cd frontend
npm run build
cd ..

# Загрузи изменения на GitHub
git add .
git commit -m "Update API URL to Ngrok tunnel"
git push

# GitHub Actions автоматически развернёт обновления!
# Проверь статус на: https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io/actions
```

---

## Этап 4: Проверка развёртывания

### 4.1 Проверь фронтенд на GitHub Pages
```
https://${GITHUB_USERNAME}.github.io
```

### 4.2 Проверь API через Ngrok
```bash
curl https://abcd-1234-5678-9012.eu.ngrok.io/api/status
```

Должен вернуться ответ:
```json
{
  "status":"OK",
  "message":"Сервер работает корректно!"
}
```

---

## 📝 Часовые пояса

✅ **Всё уже настроено правильно!**

Текущее время активации (в Yekaterinburg UTC+5):
```
activationDateTime: '2025-12-10 08:00:00'
```

**Для продакшена измени на:**
```
activationDateTime: '2025-12-11 21:21:00'
```

Файл: `/home/kacher/Projects/Project/frontend/src/pages/SuccessPage.vue` (строка 70)

---

## 🔧 Поддержание Ngrok туннеля

### Проблема: Ngrok URL меняется при перезапуске
**Решение 1: Используй Ngrok аккаунт (бесплатный)**
```bash
# Создай аккаунт на https://dashboard.ngrok.com
# Получи authtoken

ngrok config add-authtoken YOUR_AUTH_TOKEN

# Запусти с доменом
ngrok http --domain=your-custom-subdomain.ngrok.io 3000
```

**Решение 2: Используй Cloudflare Tunnel (рекомендуется)**
```bash
# На сервере
curl -L https://pkg.cloudflare.com/cloudflare-release-key.gpg | apt-key add -
apt-get install cloudflared

# Запусти туннель (без необходимости домена)
cloudflared tunnel run my-project
```

---

## ✅ Итоговая схема

```
GitHub Pages (твой фронтенд)
        ↓ HTTPS запрос
Ngrok туннель
        ↓
Твой сервер 144.31.68.248:3000
        ↓
Docker контейнер с Express.js API
        ↓
SQLite база данных
```

**IP адрес сервера НЕ видно в браузере!** 🎉

---

## 🆘 Troubleshooting

| Проблема | Решение |
|----------|---------|
| "404 на GitHub Pages" | Проверь Settings → Pages → Source = GitHub Actions |
| "CORS ошибка при запросе API" | Убедись что Ngrok URL правильный в .env |
| "API недоступен" | Проверь что контейнер запущен: `docker ps` |
| "Ngrok URL заблокирован" | Используй Cloudflare Tunnel вместо Ngrok |
| "Время активации не работает" | Проверь что время в UTC+5 (Yekaterinburg) |

---

## 📚 Ссылки

- GitHub Pages: https://pages.github.com/
- Ngrok: https://ngrok.com/
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-applications/
- Vue.js: https://vuejs.org/
- Vite: https://vitejs.dev/

**Готово! Теперь твой сайт полностью анонимный и безопасный! 🚀**
