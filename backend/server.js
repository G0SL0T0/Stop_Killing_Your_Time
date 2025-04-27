const express = require('express');
const db = require('./db');
const historyController = require('./controllers/historyController');

const app = express();
app.use(express.json());

// Проверка подключения к БД
db.authenticate()
  .then(() => console.log('✅ БД подключена'))
  .catch(err => console.error('❌ Ошибка БД:', err));


const express = require('express');
const router = express.Router(); // express.Router для организации
const historyController = require('../controllers/historyController'); // Путь

// Роут получения истории
router.get('/history', historyController.getHistory);

// Роут добавления записи
router.post('/history', historyController.addHistoryEntry);

// Роут получения статистики
router.get('/history/stats', historyController.getHistoryStats); // Для дашборда

// Роуты обновления и удаления
router.patch('/history/:id', historyController.updateHistoryEntry); // PATCH или PUT
router.delete('/history/:id', historyController.deleteHistoryEntry);

module.exports = router; // Экспорт


// Остальные роуты
app.post('/api/history', historyController.create);
app.get('/api/history', historyController.list);
app.get('/api/history/stats', historyController.getStats);

// Старт сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});