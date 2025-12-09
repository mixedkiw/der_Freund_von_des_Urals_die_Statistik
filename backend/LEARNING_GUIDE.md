# 📚 Обучающий гайд по Express.js

## Что такое Express.js?

Express.js - это минималистичный и гибкий Node.js веб-фреймворк для создания API и веб-приложений.

## Основные понятия

### 1. **Сервер (Server)**
Программа, которая постоянно работает и ожидает запросы от клиентов (браузеры, мобильные приложения).

```javascript
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
```

### 2. **Маршруты (Routes)**
Маршруты определяют, что делать при обращении к определенному URL с определенным HTTP методом.

```javascript
// Маршрут для GET запроса на /api/users
app.get('/api/users', (req, res) => {
  res.json({ message: 'Список пользователей' });
});
```

### 3. **HTTP Методы**

#### **GET** - Получить данные
```javascript
app.get('/api/users', (req, res) => {
  // Возвращаем список пользователей
  res.json(users);
});
```

#### **POST** - Создать данные
```javascript
app.post('/api/users', (req, res) => {
  const newUser = req.body;  // Данные из тела запроса
  users.push(newUser);
  res.status(201).json(newUser);
});
```

#### **PUT** - Обновить данные
```javascript
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;  // Параметр из URL
  const updatedUser = req.body;
  // Обновляем пользователя
  res.json(updatedUser);
});
```

#### **DELETE** - Удалить данные
```javascript
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  // Удаляем пользователя
  res.json({ message: 'Удалено' });
});
```

### 4. **Middleware (Обработчики)**
Функции, которые обрабатывают запрос перед его передачей дальше.

```javascript
// Парсит JSON в теле запроса
app.use(express.json());

// Логирует все запросы
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();  // Передаем управление дальше
});
```

### 5. **Параметры запроса**

#### **URL параметры** (в самом пути)
```javascript
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;  // Получаем ID из URL
  res.json({ id });
});
// /api/users/5 -> { id: '5' }
```

#### **Query параметры** (после ?)
```javascript
app.get('/api/users', (req, res) => {
  const page = req.query.page;  // Получаем из строки запроса
  res.json({ page });
});
// /api/users?page=2 -> { page: '2' }
```

#### **Body параметры** (в теле запроса)
```javascript
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;  // Получаем из тела
  res.json({ name, email });
});
// POST с телом: { "name": "Иван", "email": "ivan@example.com" }
```

### 6. **Ответ (Response)**

#### **JSON**
```javascript
res.json({ name: 'Иван', age: 25 });
```

#### **Статус код**
```javascript
res.status(201);     // 201 Created - успешно создано
res.status(400);     // 400 Bad Request - ошибка в запросе
res.status(404);     // 404 Not Found - не найдено
res.status(500);     // 500 Server Error - ошибка сервера
```

#### **Комбинация**
```javascript
res.status(201).json({ message: 'Создано', data: user });
```

## Структура проекта в этом примере

```
src/
├── index.js          ← Точка входа (запуск сервера)
├── app.js            ← Конфигурация Express
├── swagger.json      ← Документация
└── routes/
    ├── users.js      ← API для пользователей
    └── products.js   ← API для продуктов
```

### `src/index.js` - Запуск сервера
```javascript
const app = require('./app');

app.listen(3000, () => {
  console.log('Сервер запущен');
});
```

### `src/app.js` - Конфигурация
```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Маршруты
app.use('/api/users', require('./routes/users'));

module.exports = app;
```

### `src/routes/users.js` - API маршруты
```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.post('/', (req, res) => {
  const newUser = req.body;
  res.status(201).json(newUser);
});

module.exports = router;
```

## Как это работает вместе?

1. **Клиент** отправляет запрос (браузер, приложение, curl)
   ```
   GET http://localhost:3000/api/users
   ```

2. **Сервер** получает запрос и направляет его в правильный маршрут
   ```javascript
   app.use('/api/users', require('./routes/users'));
   ```

3. **Маршрут** обрабатывает запрос
   ```javascript
   router.get('/', (req, res) => {
     res.json(users);
   });
   ```

4. **Сервер** отправляет ответ обратно
   ```json
   {
     "success": true,
     "data": [...]
   }
   ```

## Жизненный цикл запроса

```
Входящий запрос
       ↓
  Middleware 1 (express.json)
       ↓
  Middleware 2 (логирование)
       ↓
  Поиск правильного маршрута
       ↓
  Обработчик маршрута (req, res)
       ↓
  Отправка ответа клиенту
```

## REST API Принципы

**REST** (Representational State Transfer) - это стиль проектирования API.

| Операция | HTTP Метод | URL | Описание |
|----------|-----------|-----|---------|
| Прочитать все | GET | `/api/users` | Получить список |
| Прочитать один | GET | `/api/users/1` | Получить по ID |
| Создать | POST | `/api/users` | Новая запись |
| Обновить | PUT | `/api/users/1` | Изменить запись |
| Удалить | DELETE | `/api/users/1` | Удалить запись |

## Примеры использования

### Инициализация проекта
```bash
npm init -y
npm install express swagger-ui-express
```

### Запуск сервера
```bash
npm start
```

### Тестирование API

**Получить данные:**
```bash
curl http://localhost:3000/api/users
```

**Создать данные:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","email":"ivan@example.com"}'
```

**Обновить данные:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван Петров"}'
```

**Удалить данные:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Обработка ошибок

```javascript
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    // Ошибка 404
    return res.status(404).json({
      success: false,
      error: 'Пользователь не найден'
    });
  }
  
  // Успех
  res.json({
    success: true,
    data: user
  });
});
```

## Следующие шаги для развития

1. **Проверка типов и валидация**
   - Использовать `joi` или `yup` для валидации
   - Проверять типы входных данных

2. **База данных**
   - MongoDB для документо-ориентированной БД
   - PostgreSQL для реляционной БД

3. **Аутентификация**
   - JWT токены для авторизации
   - Защита маршрутов

4. **Тестирование**
   - Jest для unit тестов
   - Mocha для интеграционных тестов

5. **Развертывание**
   - Docker контейнеры
   - Cloud платформы (Heroku, AWS, DigitalOcean)

## Полезные ссылки

- [Express.js Official](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [REST API Guide](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
