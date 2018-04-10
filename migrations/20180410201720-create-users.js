'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserID: {
        type: Sequelize.INTEGER
      },
      Benutzername: {
        type: Sequelize.STRING
      },
      AbteilungsID: {
        type: Sequelize.INTEGER
      },
      sugID: {
        type: Sequelize.INTEGER
      },
      Passwort: {
        type: Sequelize.STRING
      },
      Vorname: {
        type: Sequelize.STRING
      },
      Nachname: {
        type: Sequelize.STRING
      },
      is_Admin: {
        type: Sequelize.BOOLEAN
      },
      enabled: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};