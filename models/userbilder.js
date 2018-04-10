'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserBilder = sequelize.define('UserBilder', {
    LfdNr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoincrement: true,
    },
    UserID: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, { freezeTableName: true, timestamps: false });
  UserBilder.associate = function(models) {
    UserBilder.belongsTo(models.users, { foreignKey: 'UserID' });
  };
  return UserBilder;
};
