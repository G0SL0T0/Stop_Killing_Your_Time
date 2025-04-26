document.addEventListener('DOMContentLoaded', () => {
    // ----- Настройки и Переменные -----
    const API_BASE_URL = 'http://localhost:3000/api'; // Базовый URL API
    const historyTableBody = document.getElementById('history-table-body');
    const searchInput = document.getElementById('search-query');
    const categoryFilter = document.getElementById('category-filter');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');

    let currentPage = 1;
    let totalPages = 1;
    const limit = 20;

    // ----- Основная функция загрузки данных -----
    async function fetchHistory() {
        // Показываем состояние загрузки
        historyTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: var(--space-lg);">⏳ Загрузка данных...</td></tr>`;
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;

        // Параметры запроса
        const params = new URLSearchParams({
            page: currentPage,
            limit: limit,
        });

        const query = searchInput.value.trim();
        const category = categoryFilter.value;
        const dateFrom = dateFromInput.value;
        const dateTo = dateToInput.value;

        if (query) params.append('query', query);
        if (category) params.append('category', category);
        if (dateFrom) params.append('dateFrom', dateFrom);
        // Добавляем к дате "до" время 23:59:59, чтобы включить весь день
        if (dateTo) params.append('dateTo', `${dateTo}T23:59:59`);

        try {
            const response = await fetch(`${API_BASE_URL}/history?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json(); // Ожидаем { data: [], totalPages: number } от API

            renderHistoryTable(data.data || []); // Отображаем данные
            totalPages = data.totalPages || 1; // Обновляем общее количество страниц
            updatePagination(); // Обновляем контролы пагинации

        } catch (error) {
            console.error('Ошибка при загрузке истории:', error);
            historyTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--color-danger); padding: var(--space-lg);">❌ Не удалось загрузить историю: ${error.message}</td></tr>`;
            currentPage = 1;
            totalPages = 1;
            updatePagination();
        }
    }

    // ----- Функция отображения таблицы -----
    function renderHistoryTable(items) {
        historyTableBody.innerHTML = ''; // Очистка

        if (!items || items.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: var(--space-lg);">🤷‍♂️ Записей не найдено.</td></tr>`;
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');

            // Форматирование даты 
            const formattedDate = item.visitedAt
                ? new Date(item.visitedAt).toLocaleString('ru-RU', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit'
                  })
                : 'Неизвестно';

            const shortTitle = item.title && item.title.length > 80 ? item.title.substring(0, 77) + '...' : (item.title || '(Без заголовка)');
            let displayUrl = item.url || 'N/A';
             try {
                 // Попытка показать только домен или короткий путь
                 const urlObj = new URL(item.url);
                 displayUrl = urlObj.hostname + (urlObj.pathname.length > 1 ? urlObj.pathname.substring(0, 20) + '...' : '');
             } catch (e) { /* Оставляем как есть, если URL некорректный */ }


            // Создание метки категории
            const category = item.category || 'unknown';
            const categoryClass = `cat-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            const categoryBadge = `<span class="category-badge ${categoryClass}">${category}</span>`;

            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${shortTitle}</td>
                <td><a href="${item.url}" target="_blank" title="${item.url}">${displayUrl}</a></td>
                <td>${categoryBadge}</td>
            `;
            historyTableBody.appendChild(row);
        });
    }

    // ----- Функция обновления пагинации -----
    function updatePagination() {
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // ----- Обработчики событий -----

    // Применение фильтров
    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1;
        fetchHistory();
    });

    // Поиск по Enter
     searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            currentPage = 1;
            fetchHistory();
        }
    });

    // Кнопка "Назад"
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchHistory();
        }
    });

    // Кнопка "Вперед"
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchHistory();
        }
    });

    // ----- Загрузка -----
    fetchHistory();
});