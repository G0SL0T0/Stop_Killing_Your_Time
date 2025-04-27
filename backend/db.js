require('dotenv').config(); // Загружаем из .env

const { Pool } = require('pg');

// Проверка переменных окружения
const requiredEnv = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);

if (missingEnv.length > 0) {
    console.error(`❌ Ошибка: Отсутствуют необходимые переменные окружения для подключения к БД: ${missingEnv.join(', ')}`);
    console.error('Пожалуйста, убедитесь, что файл .env существует и содержит все нужные переменные.');
    process.exit(1); // Завершаем процесс, без БД не сможет работать
}

// Создаем соединения PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, // Используем DB_DATABASE вместо DB_NAME
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Порт по умолчанию 5432
    // Дополнительные настройки пула:
    // max: 20, // Максимальное количество клиентов в пуле
    // idleTimeoutMillis: 30000, // Время простоя клиента перед закрытием (мс)
    // connectionTimeoutMillis: 2000, // Время ожидания подключения (мс)
});

// Проверка соединения при запуске
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Ошибка подключения к базе данных:', err.stack);
  }
  console.log(`✅ Успешное подключение к базе данных "${process.env.DB_DATABASE}" на ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  client.release(); // Возвращаем клиента обратно в пул
});


// Экспортируем объект с методом query
// Это позволяет вызывать db.query(SQL, params) в контроллерах
module.exports = {
    query: (text, params) => pool.query(text, params),
    // Можно также экспортировать сам пул ?!
    // getClient: () => pool.connect(),
    // pool: pool
};