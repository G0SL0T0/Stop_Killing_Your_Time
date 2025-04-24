document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;

  try {
    const response = await fetch('http://localhost:3000/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url })
    });
    
    const data = await response.json();
    document.getElementById('output').innerHTML = `
      <p>✅ Добавлено: <strong>${data.title}</strong></p>
      <p>Категория: ${data.category}</p>
    `;
  } catch (err) {
    document.getElementById('output').innerHTML = `❌ Ошибка: ${err.message}`;
  }
});