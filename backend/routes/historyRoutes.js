const express = require('express');
const router = express.Router(); // Создание экземпляра роутера
const historyController = require('../controllers/historyController'); // Путь к контроллеру

// --- Роуты относительно префикса /api (в server.js) ---

// GET /api/history - Получение списка истории с фильтрами и пагинацией
router.get('/history', historyController.getHistory);

// POST /api/history - Добавление новой записи в историю
router.post('/history', historyController.addHistoryEntry);

// GET /api/history/stats - Получение статистики для дашборда
router.get('/history/stats', historyController.getHistoryStats);

// PATCH /api/history/:id - Обновление существующей записи (смена категории и т.д.)
router.patch('/history/:id', historyController.updateHistoryEntry);

// DELETE /api/history/:id - Удаление записи из истории
router.delete('/history/:id', historyController.deleteHistoryEntry);


// --- Экспорт ---
module.exports = router;