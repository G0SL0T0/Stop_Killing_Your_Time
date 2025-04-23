docker-compose up -d
node -e "require('./backend/db').sync().then(() => console.log('Таблицы созданы!'))"
node backend/server.js