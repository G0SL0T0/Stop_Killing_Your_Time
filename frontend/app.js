
fetch('http://localhost:3000') //Если приложение будет развиватся в Серверном виде, то будет менятся (а так деняг на сервера нет)
  .then(response => response.text())
  .then(text => {
    document.getElementById('status').textContent = text;
  })
  .catch(err => {
    document.getElementById('status').textContent = 'Ошибка: ' + err;
  });
