'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('statistic_user_fachgebiete', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserID: {
        type: Sequelize.INTEGER
      },
      FachgebietID: {
        type: Sequelize.INTEGER
      },
      Fragen_richtig: {
        type: Sequelize.INTEGER
      },
      Fragen_falsch: {
        type: Sequelize.INTEGER
      },
      Datum: {
        type: Sequelize.DATETIME
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('statistic_user_fachgebiete');
  }
};
