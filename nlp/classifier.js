const natural = require('natural');
const BayesClassifier = natural.BayesClassifier;
// const TfIdf = natural.TfIdf; // Может понадобиться для предобработки
// const wordnet = new natural.WordNet(); // Для поиска синонимов и др. (требует скачивания данных)
const tokenizer = new natural.WordTokenizer(); // Стандартный токенизатор

// --- 1. Создание и обучение классификатора ---

// Создаем новый классификатор
// Можно сохранять/загружать классификатор для производительности
// natural.BayesClassifier.load('classifier.json', null, function(err, classifier) { ... });
const classifier = new BayesClassifier();

console.log('[NLP] Инициализация классификатора...');

// --- Данные для обучения ---
// В будущем эти данные должны быть гораздо обширнее
// и загружаться из внешнего источника (файл, БД).
// Формат: [текст, категория]

const trainingData = [
    // Наука
    ['исследование космос новая планета найдена', 'science'],
    ['открытие в области квантовой физики новости', 'science'],
    ['биология эволюция генетика днк', 'science'],
    ['статья про черные дыры вселенная', 'science'],
    ['химический эксперимент реакция вещество', 'science'],
    ['научный журнал публикация исследование', 'science'],

    // Технологии
    ['обзор нового смартфона характеристики', 'tech'],
    ['программирование javascript nodejs разработка', 'tech'],
    ['искусственный интеллект машинное обучение нейросеть', 'tech'],
    ['обзор гаджетов умный дом технологии', 'tech'],
    ['кибербезопасность защита данных хакеры', 'tech'],
    ['релиз новой версии linux windows macos', 'tech'],
    ['стартап инвестиции венчурный капитал', 'tech'],
    ['облачные вычисления aws azure google cloud', 'tech'],

    // Мемы / Развлечения (Простые примеры)
    ['смешные котики видео подборка', 'memes'],
    ['лучшие мемы недели приколы юмор', 'memes'],
    ['забавные картинки смотреть онлайн бесплатно', 'memes'],
    ['тикток тренды челлендж видео', 'entertainment'], // Общая категория развлечений
    ['смотреть фильм сериал онлайн новинки', 'entertainment'],
    ['игровой стрим прохождение игры', 'entertainment'],
    ['музыкальный клип новый хит чарты', 'entertainment'],

    // Новости
    ['политика экономика последние новости дня', 'news'],
    ['события в мире главные новости', 'news'],
    ['финансы курс валют биржа акции', 'news'],
    ['местные новости происшествия город', 'news'],
    ['спорт результаты матчей чемпионат', 'news'],

    // Социальные сети (Часто определяются по домену, но можно и по заголовкам)
    ['вконтакте моя страница друзья сообщения', 'social'],
    ['лента новостей друзья фото лайки', 'social'],
    ['обсуждение в группе форум сообщество', 'social'],
    ['новый пост в инстаграм фото видео', 'social'],

    // Образование / Продуктивность
    ['учебник по математике онлайн курс лекция', 'education'],
    ['изучение английского языка грамматика слова', 'education'],
    ['онлайн курсы программирование дизайн маркетинг', 'education'],
    ['как повысить продуктивность тайм менеджмент', 'productivity'],
    ['статья о планировании задач цели', 'productivity'],

    // Другое / Неопределенное
    ['прогноз погоды на завтра', 'other'],
    ['купить билеты авиа жд поезд', 'other'],
    ['рецепт пирога как приготовить', 'other'],
    ['форум обсуждение вопросов ответы', 'other'], // Может пересекаться с social
];

// --- Обучение классификатора ---
console.log(`[NLP] Начало обучения на ${trainingData.length} примерах...`);
const startTime = Date.now();

trainingData.forEach(item => {
    const text = item[0];
    const category = item[1];
    // Простое добавление: токенизируем и добавляем
    // Для улучшения используем стемминг (natural.PorterStemmerRu)
    // или удаление стоп-слов.
    // const tokens = tokenizer.tokenize(text.toLowerCase());
    // classifier.addDocument(tokens, category);
    classifier.addDocument(text.toLowerCase(), category); // Классификатор сам токенизирует
});

// Тренируем классификатор
// Для BayesClassifier тренировка происходит при добавлении документов,
// но для (LogisticRegressionClassifier) может потребоваться отдельный вызов train().
// classifier.train(); // Для Bayes не нужен явный train после addDocument

const endTime = Date.now();
console.log(`[NLP] Обучение завершено за ${endTime - startTime} мс.`);


// --- 2. Функция классификации ---

const MIN_CONFIDENCE_THRESHOLD = 0.5; // Минимальный порог уверенности под категорию

/**
 * Классифицирует предоставленный текст (заголовок страницы).
 * @param {string} text - Текст для классификации.
 * @returns {string} Предсказанная категория (например, 'science', 'tech', 'memes', 'unknown').
 */
function classifyText(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return 'unknown'; // Нечего классифицировать
    }

    // const tokens = tokenizer.tokenize(text.toLowerCase());
    // const classifications = classifier.getClassifications(tokens);

    const classifications = classifier.getClassifications(text.toLowerCase());

    // classifications - это массив объектов [{ label: 'category', value: 0.9 }, ...]      ! !
    // отсортированный по убыванию уверенности (value).                                    ! !

    if (classifications && classifications.length > 0) {
        const bestMatch = classifications[0];

        console.log(`[NLP] Классификация для "${text.substring(0, 50)}...":`, classifications.slice(0, 3)); // Логируем топ-3 варианта

        // Проверяем порог уверенности
        if (bestMatch.value >= MIN_CONFIDENCE_THRESHOLD) {
            // Ээвристика: если вторая по уверенности категория очень близка,
            // возвращаяем 'unknown' или более общую категорию.
            if (classifications.length > 1) {
                const secondMatch = classifications[1];
                // Если разница между первой и второй уверенностью мала (меньше 10%)
                if ((bestMatch.value - secondMatch.value) < (bestMatch.value * 0.1)) {
                     console.log(`[NLP] Низкая разница уверенности (${bestMatch.label}: ${bestMatch.value.toFixed(3)}, ${secondMatch.label}: ${secondMatch.value.toFixed(3)}). Возвращаем 'mixed/unknown'.`);
                    return 'unknown'; // Какая-то категория 'mixed'
                }
            }
            return bestMatch.label; // Возвращаем наиболее вероятную категорию
        } else {
             console.log(`[NLP] Низкая уверенность (${bestMatch.label}: ${bestMatch.value.toFixed(3)} < ${MIN_CONFIDENCE_THRESHOLD}). Возвращаем 'unknown'.`);
            return 'unknown'; // Уверенность слишком низкая
        }
    }

    return 'unknown'; // Если классификатор ничего не вернул
}

// --- 3. Сохранение обученного классификатора ---
// classifier.save('classifier.json', function(err, classifier) {
//     if (err) {
//         console.error("[NLP] Ошибка сохранения классификатора:", err);
//     } else {
//         console.log("[NLP] Обученный классификатор сохранен в classifier.json");
//     }
// });


// --- 4. Экспорт основной функции ---
module.exports = {
    classifyText,
    // Экспортировать сам классификатор, при условии что нужно получить все вероятности
    // getRawClassifications: (text) => text ? classifier.getClassifications(text.toLowerCase()) : [],
};


// --- Начало ---
if (require.main === module) {
    console.log("\n--- Тестирование классификатора ---");
    const testTexts = [
        "Ученые открыли новый вид бактерий в океане", // science
        "Как установить Node.js на Ubuntu linux", // tech
        "Фото приколы и мемы за сегодня", // memes
        "Погода в Москве на 5 дней", // other или unknown
        "Рецепт борща классический", // other
        "Квантовая запутанность объяснение для чайников", // science
        "Facebook купил Instagram за миллиард", // tech/news/social?
        "Просто текст без особого смысла", // unknown
        " ", // unknown
        null, // unknown
    ];

    testTexts.forEach(text => {
        const category = classifyText(text);
        console.log(`"${text}" => ${category}`);
    });
}