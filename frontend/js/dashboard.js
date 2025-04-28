// Получение данных из API
async function fetchData() {
  try {
      const response = await fetch('/api/dashboard-data'); // Замените на реальный URL вашего API
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return null;
  }
}

// Функция обновления статистики на странице
function updateStats(data) {
  document.getElementById('total-time').textContent = formatTime(data.totalTime);
  document.getElementById('productive-time').textContent = formatTime(data.productiveTime);
  document.getElementById('unproductive-time').textContent = formatTime(data.unproductiveTime);
}

// Функция для форматирования времени
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Функция создания круговой диаграммы (категории контента)
function createCategoryChart(data) {
  const ctx = document.getElementById('category-chart').getContext('2d');
  new Chart(ctx, {
      type: 'pie',
      data: {
          labels: data.categoryLabels,
          datasets: [{
              label: 'Время по категориям',
              data: data.categoryData,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false, // Разрешить изменение пропорций
          plugins: {
              legend: {
                  position: 'bottom', // Расположение легенды снизу
              },
              title: {
                  display: true,
                  text: 'Распределение времени по категориям',
                  font: {
                      size: 16
                  }
              }
          }
      }
  });
}

// Функция для создания столбчатой диаграммы (время по сайтам)
function createWebsiteChart(data) {
  const ctx = document.getElementById('website-chart').getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: data.websiteLabels,
          datasets: [{
              label: 'Время по сайтам',
              data: data.websiteData,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true, // Начинать ось Y с нуля
                  title: {
                      display: true,
                      text: 'Время (секунды)'
                  }
              }
          },
          plugins: {
              legend: {
                  display: false // Скрыть легенду
              },
              title: {
                  display: true,
                  text: 'Время использования сайтов',
                  font: {
                      size: 16
                  }
              }
          }
      }
  });
}

// Основная функция инициализации
async function initDashboard() {
  const data = await fetchData();

  if (data) {
      updateStats(data);
      createCategoryChart(data);
      createWebsiteChart(data);
  } else {
      // Обработка ошибки
      console.error('Не удалось получить данные для дашборда.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard JS Initialized"); // Для отладки

    // ----- Константы и Переменные -----
    const API_BASE_URL = 'http://localhost:3000/api'; // URL API

    // --- Элементы DOM ---
    const timeFiltersContainer = document.querySelector('.time-filters');
    const timeChartTitle = document.getElementById('time-chart-title');
    const categoryChartTitle = document.getElementById('category-chart-title');
    const totalTimeEl = document.getElementById('total-time');
    const productiveTimeEl = document.getElementById('productive-time');
    const productivePercentEl = document.getElementById('productive-percent');
    const distractingTimeEl = document.getElementById('distracting-time');
    const distractingPercentEl = document.getElementById('distracting-percent');
    const topCategoryEl = document.getElementById('top-category');
    const topSiteEl = document.getElementById('top-site');
    const timeChartCanvas = document.getElementById('time-chart');
    const categoryChartCanvas = document.getElementById('category-chart');

    // --- Состояние Дашборда ---
    let currentPeriod = 'week'; // Значение по умолчанию (как в HTML)
    let timeChartInstance = null;   // Для хранения экземпляра графика времени
    let categoryChartInstance = null; // Для хранения экземпляра графика категорий

    /**
     * Форматирует время из минут в строку "X ч Y мин".
     * @param {number|null|undefined} totalMinutes - Общее количество минут.
     * @returns {string} Отформатированная строка времени.
     */
    function formatTime(totalMinutes) {
        if (totalMinutes === null || totalMinutes === undefined || isNaN(totalMinutes)) {
            return '0 мин';
        }
        const minutes = Math.round(totalMinutes); // Округляем до целых минут
        if (minutes === 0) return '0 мин';

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        let result = '';
        if (hours > 0) {
            result += `${hours} ч `;
        }
        if (remainingMinutes > 0) {
            result += `${remainingMinutes} мин`;
        }
        return result.trim(); // Убираем лишние пробелы
    }

    /**
     * Возвращает текстовое описание периода для заголовков.
     * @param {string} period - ('day', 'week', 'month').
     * @returns {string} Текстовое представление.
     */
    function getPeriodText(period) {
        switch (period) {
            case 'day': return 'за сегодня';
            case 'week': return 'за неделю';
            case 'month': return 'за месяц';
            default: return `за ${period}`;
        }
    }

    /**
     * Обновляет значения в карточках статистики.
     * @param {object} stats - Объект со статистикой из API.
     */
    function updateStatCards(stats = {}) {
        totalTimeEl.textContent = formatTime(stats.totalTime); // Используем formatTime
        productiveTimeEl.textContent = formatTime(stats.productiveTime);
        productivePercentEl.textContent = `${stats.productivePercent ?? 0}% от общего`;
        distractingTimeEl.textContent = formatTime(stats.distractingTime);
        distractingPercentEl.textContent = `${stats.distractingPercent ?? 0}% от общего`;
        topCategoryEl.textContent = stats.topCategory || '-';
        topSiteEl.textContent = stats.topSite || '-';
    }

    /**
     * Запрашивает данные статистики с бэкенда для указанного периода.
     * @param {string} period - Период ('day', 'week', 'month').
     * @returns {Promise<object|null>} Объект со статистикой или null в случае ошибки.
     */
    async function fetchDashboardData(period) {
        console.log(`Запрос данных для периода: ${period}`);
        try {
            const response = await fetch(`${API_BASE_URL}/history/stats?period=${period}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Ошибка HTTP: ${response.status}` }));
                throw new Error(errorData.message || `Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log("Полученные данные:", data);
            return data;
        } catch (error) {
            console.error(`Ошибка при получении данных для периода ${period}:`, error);
            // Отобразить ошибку пользователю
            totalTimeEl.textContent = "Ошибка";
            productiveTimeEl.textContent = "-";
            productivePercentEl.textContent = "-";
            distractingTimeEl.textContent = "-";
            distractingPercentEl.textContent = "-";
            topCategoryEl.textContent = "-";
            topSiteEl.textContent = "-";
            // очистить/скрыть графики !?
            if (timeChartInstance) timeChartInstance.destroy();
            if (categoryChartInstance) categoryChartInstance.destroy();
            timeChartInstance = null;
            categoryChartInstance = null;
            timeChartTitle.textContent = "Ошибка загрузки данных";
            categoryChartTitle.textContent = "Ошибка загрузки данных";
            return null; // Возвращаем null, чтобы вызывающая функция знала об ошибке
        }
    }

    /**
     * Обновляет визуальное состояние кнопок фильтра времени.
     * @param {string} activePeriod - Период, который должен быть активным.
     */
    function updateActiveFilterButton(activePeriod) {
        const filterButtons = timeFiltersContainer.querySelectorAll('.btn');
        filterButtons.forEach(button => {
            if (button.dataset.period === activePeriod) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    /**
     * Инициализирует или обновляет график "Время онлайн по дням".
     * @param {object} timeChartData - Данные для графика { labels: [], data: [] }
     */
    function initializeTimeChart(timeChartData = { labels: [], data: [] }) {
        // Уничтожаем предыдущий экземпляр графика, если он есть
        if (timeChartInstance) {
            timeChartInstance.destroy();
        }

        const ctx = timeChartCanvas.getContext('2d');
        if (!ctx) {
            console.error('Не удалось получить контекст для time-chart');
            return;
        }

        timeChartInstance = new Chart(ctx, {
            type: 'bar', // или 'line'
            data: {
                labels: timeChartData.labels || [],
                datasets: [{
                    label: 'Время онлайн (минуты)',
                    data: timeChartData.data || [],
                    backgroundColor: 'rgba(67, 97, 238, 0.6)', // var(--color-primary) с прозрачностью
                    borderColor: 'rgba(67, 97, 238, 1)', // var(--color-primary)
                    borderWidth: 1,
                    borderRadius: 4, // Небольшое скругление столбиков
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Важно для подгонки под контейнер
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                             display: true,
                             text: 'Минуты'
                         }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Можно скрыть, т.к. только один набор данных
                    },
                    tooltip: {
                        callbacks: { // Форматируем подсказку
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                     // Используем нашу функцию форматирования
                                     label += formatTime(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
        // Обновляем заголовок графика
        timeChartTitle.textContent = `Время онлайн по дням (${getPeriodText(currentPeriod)})`;
    }

    /**
     * Инициализирует или обновляет график "Разбивка времени по категориям".
     * @param {object} categoryChartData - Данные для графика { labels: [], data: [] }
     */
    function initializeCategoryChart(categoryChartData = { labels: [], data: [] }) {
        // Уничтожаем предыдущий экземпляр
        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }

        const ctx = categoryChartCanvas.getContext('2d');
         if (!ctx) {
            console.error('Не удалось получить контекст для category-chart');
            return;
        }

        // Палитра цветов (можно расширить или генерировать)
        const backgroundColors = [
            'rgba(67, 97, 238, 0.7)',  // Primary
            'rgba(76, 201, 240, 0.7)', // Success
            'rgba(247, 37, 133, 0.7)', // Accent
            'rgba(114, 9, 183, 0.7)',  // Secondary
            'rgba(248, 150, 30, 0.7)', // Warning
            'rgba(173, 181, 189, 0.7)',// Gray
            'rgba(239, 35, 60, 0.7)',  // Danger
        ];

        categoryChartInstance = new Chart(ctx, {
            type: 'doughnut', // или 'pie'
            data: {
                labels: categoryChartData.labels || [],
                datasets: [{
                    label: 'Время (минуты)',
                    data: categoryChartData.data || [],
                    backgroundColor: backgroundColors.slice(0, (categoryChartData.labels || []).length), // Берем цвета по кол-ву категорий
                    borderColor: '#ffffff', // Белые разделители
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                 plugins: {
                    legend: {
                        position: 'bottom', // Легенда снизу
                         labels: {
                            padding: 15 // Отступ для легенды
                        }
                    },
                     tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.parsed;
                                if (value !== null) {
                                    label += formatTime(value) + ` (${context.dataset.data[context.dataIndex]} мин)`;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
        // Обновляем заголовок
        categoryChartTitle.textContent = `Разбивка времени по категориям (${getPeriodText(currentPeriod)})`;
    }

    /**
     * Обработчик кликов по кнопкам фильтров времени.
     * @param {Event} event - Событие клика.
     */
    function handleFilterClick(event) {
        const target = event.target;
        // Проверяем, что кликнули по кнопке с атрибутом data-period
        if (target.tagName === 'BUTTON' && target.dataset.period) {
            const selectedPeriod = target.dataset.period;
            // Загружаем данные
            if (selectedPeriod !== currentPeriod) {
                currentPeriod = selectedPeriod;
                loadDashboard(currentPeriod);
            }
        }
    }

    /**
     * Основная функция загрузки и обновления дашборда для указанного периода.
     * @param {string} period - Период ('day', 'week', 'month').
     */
    async function loadDashboard(period) {
        console.log(`Загрузка дашборда для периода: ${period}`);
        // Можно добавить класс "loading" на основной контейнер для отображения спиннера
        // document.querySelector('.dashboard-container').classList.add('loading');

        updateActiveFilterButton(period); // Обновляем активную кнопку

        // Запрашиваем данные
        const stats = await fetchDashboardData(period);

        // Если данные успешно получены, обновляем интерфейс
        if (stats) {
            updateStatCards(stats);
            initializeTimeChart(stats.timeChartData); // Передаем данные для графика времени
            initializeCategoryChart(stats.categoryChartData); // Передаем данные для графика категорий
        } else {
            // Если произошла ошибка при загрузке, fetchDashboardData уже обработал UI
            console.log("Обновление UI пропущено из-за ошибки загрузки данных.");
        }

        // Убираем класс "loading"
        // document.querySelector('.dashboard-container').classList.remove('loading');
    }

    // ----- Инициализация -----

    // Добавляем слушатель событий на контейнер с кнопками
    if (timeFiltersContainer) {
        timeFiltersContainer.addEventListener('click', handleFilterClick);
    } else {
        console.error('Контейнер с фильтрами времени ".time-filters" не найден.');
    }

    // Запускаем начальную загрузку дашборда для периода
    loadDashboard(currentPeriod);

});


// Вызываем функцию инициализации при загрузке страницы
window.addEventListener('load', initDashboard);