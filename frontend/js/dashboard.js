
async function loadStats() { // Загрузка данных с бэкенда
    const response = await fetch('http://localhost:3000/api/history/stats');
    const data = await response.json();
    
    document.getElementById('total-time').textContent = 
      `${Math.floor(data.totalTime / 60)} ч ${data.totalTime % 60} мин`;
    
    const categoriesList = document.getElementById('categories-list');
    data.categories.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = `${cat.name}: ${cat.count} просмотров`;
      categoriesList.appendChild(li);
    });
  }
  
  
  function initChart() { // Инициализация графика (Chart.js)
    const ctx = document.getElementById('time-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [{
          label: 'Минуты в соцсетях',
          data: [45, 60, 30, 90, 50, 120, 80],
          backgroundColor: '#3498db'
        }]
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    initChart();
  });