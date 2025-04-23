const express = require('express');
const db = require('./db');
const History = require('./models/History');

const app = express();
const PORT = 3000;

// Проверка подключения к БД
db.authenticate()
  .then(() => console.log('БД подключена'))
  .catch(err => console.error('Ошибка БД:', err));

// Роут для проверки работы
app.get('/', (req, res) => {
  res.send('Сервис работает.');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});