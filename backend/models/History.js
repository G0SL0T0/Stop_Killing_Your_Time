const { DataTypes } = require('sequelize');
const db = require('../db');

const History = db.define('History', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
});

module.exports = History;