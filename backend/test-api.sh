#!/bin/bash
# Примеры тестирования API с помощью curl

echo "=== Проверка статуса сервера ==="
curl http://localhost:3000/api/status | jq .

echo -e "\n=== Получить всех пользователей ==="
curl http://localhost:3000/api/users | jq .

echo -e "\n=== Получить пользователя по ID ==="
curl http://localhost:3000/api/users/1 | jq .

echo -e "\n=== Создать нового пользователя ==="
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Алексей",
    "email": "alex@example.com",
    "age": 35
  }' | jq .

echo -e "\n=== Обновить пользователя ==="
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Обновленный",
    "age": 26
  }' | jq .

echo -e "\n=== Получить все продукты ==="
curl http://localhost:3000/api/products | jq .

echo -e "\n=== Создать новый продукт ==="
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Наушники",
    "price": 5000,
    "description": "Беспроводные наушники",
    "stock": 15
  }' | jq .

echo -e "\n=== Удалить пользователя ==="
curl -X DELETE http://localhost:3000/api/users/2 | jq .
