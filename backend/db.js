require('dotenv').config(); // Загружаем переменные из .env

const { Pool } = require('pg');

// Проверка необходимых переменных
const requiredEnv = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);

if (missingEnv.length > 0) {
    console.error(`❌ Ошибка: Отсутствуют необходимые переменные окружения для подключения к БД: ${missingEnv.join(', ')}`);
    console.error('Пожалуйста, убедитесь, что файл .env существует и содержит все нужные переменные.');
    process.exit(1); // Завершаем процесс: без БД не сможет работать
}

// Создаем пул соединений PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, // В .env верная переменная?
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Порт по умолчанию 5432
    // В будущем можно добавить настройки пула:
    // max: 10, // Макс. клиентов
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
});

// Проверка соединения при запуске
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Ошибка подключения к базе данных:', err.stack);
  }
  // Выводим сообщение только один раз при успешном старте
  if (!pool._connected) { // Не выводит сообщение при каждом connect
      console.log(`✅ Успешное подключение к базе данных "${process.env.DB_DATABASE}"`);
      pool._connected = true;
  }
  client.release(); // Возвращаем клиента обратно в пул
});

// Добавляем обработчик ошибок для пула
pool.on('error', (err, client) => {
  console.error('❌ Неожиданная ошибка в PostgreSQL клиенте:', err);
  // Можно добавить логику переподключения или завершения процесса
  // process.exit(-1);
});

// Экспортируем объект с методом query
module.exports = {
    /**
     * Выполняет SQL-запрос к базе данных.
     * @param {string} text - Текст SQL-запроса с плейсхолдерами ($1, $2...).
     * @param {Array} [params=[]] - Массив параметров для SQL-запроса.
     * @returns {Promise<import('pg').QueryResult>} Промис с результатом запроса.
     * @throws {Error} Если происходит ошибка выполнения запроса.
     */
    query: async (text, params = []) => {
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            // Логирование выполненных запросов (включать/выключать через env)!
            if (process.env.LOG_QUERIES === 'true') {
                console.log('[DB Query]', { text, params: params.length > 10 ? `[${params.length} params]` : params, duration: `${duration}ms`, rows: res.rowCount });
            }
            return res;
        } catch (err) {
            console.error('❌ Ошибка выполнения SQL запроса:', { text, params });
            console.error(err); // Лог ошибки
            throw err; // Пробрасываем ошибку дальше для обработки
        }
    },
    // Функция для получения клиента для транзакций
    getClient: async () => {
        const client = await pool.connect();
        return client;
    }
};