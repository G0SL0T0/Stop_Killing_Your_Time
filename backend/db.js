const { Sequelize } = require('sequelize');

const db = new Sequelize(
  process.env.DB_NAME || 'skyt',
  process.env.DB_USER || 'skyt',
  process.env.DB_PASSWORD || 'skyt',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  }
);

module.exports = db;