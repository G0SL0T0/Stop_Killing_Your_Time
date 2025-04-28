require('dotenv').config(); // Загружаем из .env файла

const { Pool } = require('pg');

// Проверка наличия необходимых переменных окружения
const requiredEnv = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);

if (missingEnv.length > 0) {
    console.error(`❌ Ошибка: Отсутствуют необходимые переменные окружения для подключения к БД: ${missingEnv.join(', ')}`);
    console.error('Пожалуйста, убедитесь, что файл .env существует и содержит все нужные переменные.');
    process.exit(1); // Завершаем процесс (без БД нет работоспособности)
}

// Создаем пул соединений PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, // В .env используется это имя переменной?
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Порт по умолчанию 5432
    // Можно добавить настройки пула:
    // max: 10, // Макс. клиентов
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
});

// Проверка соединения при запуске
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Ошибка подключения к базе данных:', err.stack);
  }
  console.log(`✅ Успешное подключение к базе данных "${process.env.DB_DATABASE}"`);
  client.release(); // Возвращаем клиента обратно в пул
});

// Экспортируем объект query
module.exports = {
    /**
     * Выполняет SQL-запрос к базе данных.
     * @param {string} text - Текст SQL-запроса с плейсхолдерами ($1, $2...).
     * @param {Array} params - Массив параметров для SQL-запроса.
     * @returns {Promise<QueryResult>} Промис с результатом запроса.
     */
    query: (text, params) => pool.query(text, params),
};