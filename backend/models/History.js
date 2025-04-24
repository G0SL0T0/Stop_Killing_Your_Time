module.exports = (sequelize, DataTypes) => {
  return sequelize.define('History', {
    url: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    duration: { type: DataTypes.INTEGER }
  });
};