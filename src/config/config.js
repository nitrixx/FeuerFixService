const Sequelize = require('sequelize');

module.exports = {
  development: {
    username: "root",
    password: "123456",
    database: "dev",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: Sequelize.Op,
  },
  test: {
    username: "travis",
    password: null,
    database: "dev",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: Sequelize.Op,
    logging: false,
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: Sequelize.Op,
  }
};
