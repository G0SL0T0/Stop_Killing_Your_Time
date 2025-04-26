const db = require('../db');
// const History = require('../models/History');

// --- Получение списка истории ---
exports.getHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Текущая страница
    const limit = parseInt(req.query.limit) || 20; // Записей на странице
    const offset = (page - 1) * limit; // Смещение для SQL запроса

    // Параметры фильтрации
    const query = req.query.query; // Строка поиска
    const category = req.query.category;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo; // Присылает YYYY-MM-DDTHH:mm:ss

    // Массивы для построения динамического SQL запроса
    let whereClauses = []; // Условия WHERE
    let queryParams = []; // Параметры для SQL запроса ($1, $2...)
    let paramIndex = 1; // Счетчик параметров

    // Добавляем фильтр по поисковому запросу (ищем в title и url)
    if (query) {
        whereClauses.push(`(title ILIKE $${paramIndex} OR url ILIKE $${paramIndex})`);
        queryParams.push(`%${query}%`);
        paramIndex++;
    }

    // Добавляем фильтр по категории
    if (category) {
        whereClauses.push(`category = $${paramIndex}`);
        queryParams.push(category);
        paramIndex++;
    }

    // Добавляем фильтр по дате "от"
    if (dateFrom) {
        whereClauses.push(`visited_at >= $${paramIndex}`);
        queryParams.push(dateFrom);
        paramIndex++;
    }

    // Добавляем фильтр по дате "до"
    if (dateTo) {
        whereClauses.push(`visited_at <= $${paramIndex}`);
        queryParams.push(dateTo);
        paramIndex++;
    }

    // Собираем строку WHERE
    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    try {
        // --- Запрос №1: Получаем общее количество записей (для пагинации) ---
        const countQuery = `SELECT COUNT(*) FROM history ${whereString}`;
        const countResult = await db.query(countQuery, queryParams); // Используем те же параметры фильтрации
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        // --- Запрос №2: Получаем сами записи с учетом пагинации и сортировки ---
        // Добавляем параметры для LIMIT и OFFSET к существующим параметрам
        const dataQueryParams = [...queryParams, limit, offset];
        const dataQuery = `
            SELECT id, title, url, visited_at AS "visitedAt", category
            FROM history
            ${whereString}
            ORDER BY visited_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `; // Используем AS "visitedAt" для соответствия camelCase на фронте

        const dataResult = await db.query(dataQuery, dataQueryParams);

        // Отправляем ответ
        res.status(200).json({
            data: dataResult.rows,
            totalPages: totalPages,
            currentPage: page,
            totalItems: totalItems
        });

    } catch (err) {
        console.error('Ошибка при получении истории:', err);
        res.status(500).json({ message: 'Ошибка сервера при получении истории' });
    }
};

// --- Добавление новой записи в историю ---
exports.addHistoryEntry = async (req, res) => {
    const { title, url, category } = req.body;

    // Простая валидация
    if (!url) {
        return res.status(400).json({ message: 'URL является обязательным полем' });
    }

    // Здесь логика NLP (автоматическая классификация, если category не передана)
    const finalCategory = category || 'unknown'; // ЭТО ПРИМЕР!

    try {
        const insertQuery = `
            INSERT INTO history (title, url, category, visited_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING id, title, url, visited_at AS "visitedAt", category
        `; // NOW() - текущее время БД
        const queryParams = [title || '', url, finalCategory];

        const result = await db.query(insertQuery, queryParams);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('Ошибка при добавлении записи в историю:', err);
        // Обработка специфических ошибок БД (например, нарушение уникальности URL, если есть)
        if (err.code === '23505') { // Код ошибки unique_violation в PostgreSQL
             return res.status(409).json({ message: 'Запись с таким URL уже существует (если есть ограничение)' });
        }
        res.status(500).json({ message: 'Ошибка сервера при добавлении записи' });
    }
};

// --- Получение статистики ---
exports.getHistoryStats = async (req, res) => {
    const period = req.query.period || 'week'; // 'day', 'week', 'month'

    // Далее: Реализовать логику получения статистики из БД
    // - Подсчет общего времени
    // - Подсчет времени по категориям (продуктивное/развлекательное)
    // - Определение топ-категории/сайта
    // - Подготовка данных для графиков (время по дням/категориям)

    try {
         // Пример данных (Заменить запросами к БД)
         const totalTimeMinutes = Math.floor(Math.random() * 300) + 60; // Случайное время
         const productiveTime = Math.floor(totalTimeMinutes * (Math.random() * 0.4 + 0.3)); // 30-70%
         const distractingTime = totalTimeMinutes - productiveTime;

         const stats = {
            totalTime: totalTimeMinutes,
            productiveTime: productiveTime,
            distractingTime: distractingTime,
            productivePercent: Math.round((productiveTime / totalTimeMinutes) * 100),
            distractingPercent: Math.round((distractingTime / totalTimeMinutes) * 100),
            topCategory: 'Технологии', 
            topSite: 'github.com', 
            // Данные для графиков 
            timeChartData: {
                labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10),
            },
            categoryChartData: {
                labels: ['Технологии', 'Соцсети', 'Новости', 'Разработка', 'Другое'],
                data: [120, 80, 45, 150, 30],
            }
        };
        res.status(200).json(stats);
    } catch (err) {
         console.error('Ошибка при получении статистики:', err);
         res.status(500).json({ message: 'Ошибка сервера при получении статистики' });
    }

};

// --- Обновление записи (Ссмена категории вручную) ---
exports.updateHistoryEntry = async (req, res) => {
    const { id } = req.params; // ID записи из URL (/api/history/:id)
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ message: 'Не указана новая категория' });
    }

    try {
        const updateQuery = `
            UPDATE history SET category = $1
            WHERE id = $2
            RETURNING id, title, url, visited_at AS "visitedAt", category
        `;
        const result = await db.query(updateQuery, [category, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Запись не найдена' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Ошибка при обновлении записи ${id}:`, err);
        res.status(500).json({ message: 'Ошибка сервера при обновлении записи' });
    }
};

// --- Удаление записи ---
exports.deleteHistoryEntry = async (req, res) => {
    const { id } = req.params; // ID записи из URL (/api/history/:id)

    try {
        const deleteQuery = 'DELETE FROM history WHERE id = $1';
        const result = await db.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Запись не найдена' });
        }

        res.status(204).send(); // Нет содержимого для ответа
    } catch (err) {
         console.error(`Ошибка при удалении записи ${id}:`, err);
         res.status(500).json({ message: 'Ошибка сервера при удалении записи' });
    }
};