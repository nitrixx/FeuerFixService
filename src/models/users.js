'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Benutzername: DataTypes.STRING,
    AbteilungsID: DataTypes.INTEGER,
    sugID: DataTypes.INTEGER,
    Passwort: DataTypes.STRING,
    Vorname: DataTypes.STRING,
    Nachname: DataTypes.STRING,
    is_Admin: DataTypes.BOOLEAN,
    enabled: DataTypes.BOOLEAN
  }, { freezeTableName: true, timestamps: false });
  users.associate = function(models) {
    users.belongsToMany(models.question, { through: 'reported', foreignKey: 'UserID' });
    users.hasOne(models.UserBilder, { foreignKey: 'UserID' });
    users.hasMany(models.statistic, { foreignKey: 'UserID' });
  };
  return users;
};
