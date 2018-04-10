'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fragen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      FragenID: {
        type: Sequelize.INTEGER
      },
      FachgebietID: {
        type: Sequelize.INTEGER
      },
      Frage: {
        type: Sequelize.STRING
      },
      Antwort_A: {
        type: Sequelize.STRING
      },
      Antwort_B: {
        type: Sequelize.STRING
      },
      Antwort_C: {
        type: Sequelize.STRING
      },
      richtige_Antwort: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fragen');
  }
};
