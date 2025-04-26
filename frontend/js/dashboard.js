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

// Вызываем функцию инициализации при загрузке страницы
window.addEventListener('load', initDashboard);