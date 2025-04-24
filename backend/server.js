const express = require('express');
const db = require('./db');
const historyController = require('./controllers/historyController');

const app = express();
app.use(express.json());

// Проверка подключения к БД
db.authenticate()
  .then(() => console.log('✅ БД подключена'))
  .catch(err => console.error('❌ Ошибка БД:', err));

// Роуты
app.post('/api/history', historyController.create);
app.get('/api/history', historyController.list);

// Старт сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});