'use strict';
module.exports = (sequelize, DataTypes) => {
  var profilePicture = sequelize.define('profilePicture', {
    LfdNr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoincrement: true,
    },
    UserID: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'UserBilder',
  });
  profilePicture.associate = function(models) {
    profilePicture.belongsTo(models.users, { foreignKey: 'UserID' });
  };
  return profilePicture;
};
