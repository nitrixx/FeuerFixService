'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
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
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'users',
  });
  user.associate = function(models) {
    user.belongsToMany(models.question, { through: 'reported', foreignKey: 'UserID' });
    user.hasOne(models.profilePicture, { foreignKey: 'UserID' });
    user.hasMany(models.statistic, { foreignKey: 'UserID' });
  };
  return user;
};
