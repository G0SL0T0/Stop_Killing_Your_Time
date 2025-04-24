module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('Histories', {
        id: { 
          type: Sequelize.INTEGER, 
          primaryKey: true, 
          autoIncrement: true 
        },
        url: { type: Sequelize.STRING, allowNull: false },
        title: { type: Sequelize.STRING },
        category: { type: Sequelize.STRING },
        duration: { type: Sequelize.INTEGER },
        createdAt: { type: Sequelize.DATE },
        updatedAt: { type: Sequelize.DATE }
      });
    },
    async down(queryInterface) {
      await queryInterface.dropTable('Histories');
    }
  };