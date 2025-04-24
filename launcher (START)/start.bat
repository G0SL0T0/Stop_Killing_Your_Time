docker-compose up -d
npm install --save-dev sequelize-cli
npx sequelize-cli init
node -e "require('./backend/db').sync().then(() => console.log('Таблицы созданы!'))"
node backend/server.js
npm install natural