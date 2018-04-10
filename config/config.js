import Sequelize from 'sequelize';

module.exports = {
  development: {
    username: "root",
    password: "123456",
    database: "dev",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: Sequelize.Op,
    freezeTableName: true,
    timestamps: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: Sequelize.Op,
    freezeTableName: true,
    timestamps: false,
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: Sequelize.Op,
    freezeTableName: true,
    timestamps: false,
  }
};
