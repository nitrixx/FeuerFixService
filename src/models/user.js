'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isEnabled: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Answer, { through: models.AnsweredQuestion });
  };
  return User;
};
