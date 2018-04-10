'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fachgebiete', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      FachgebietID: {
        type: Sequelize.INTEGER
      },
      FachgebietName: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fachgebiete');
  }
};
