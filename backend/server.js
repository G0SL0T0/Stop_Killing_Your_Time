require('dotenv').config(); // Переменные окружения (.env файл или /backend)
const express = require('express');
const cors = require('cors'); // Импортируем cors

// --- Подключение модулей ---
const db = require('./db'); // Модуль для работы с БД (pg)
const historyRoutes = require('./routes/historyRoutes'); // Подключение роутов истории

// --- Инициализация Express ---
const app = express();

// --- Middleware ---
app.use(cors()); // CORS для разрешения запросов с фронтенда (localhost:5500)
app.use(express.json()); // Для парсинга JSON тел запросов (Content-Type: application/json)

// --- Основные Роуты API ---
// Все роуты, определенные в historyRoutes, будут в /api
app.use('/api', historyRoutes);

// --- Тестовый корневой роут ---
app.get('/', (req, res) => {
    res.send('👋 SKYT Backend API is running!');
});

// --- Обработка несуществующих роутов (404) ---
app.use((req, res, next) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

// --- Глобальный обработчик ошибок ---
app.use((err, req, res, next) => {
    console.error('❌ Произошла ошибка:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Внутренняя ошибка сервера',
        // Stack trace в режиме разработки
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});


// --- Запуск сервера ---
const PORT = process.env.PORT || 3000; // Порт из .env или 3000
app.listen(PORT, () => {
    // Сообщение о подключении в db.js
    console.log(`🚀 Сервер SKYT запущен на http://localhost:${PORT}`);
});