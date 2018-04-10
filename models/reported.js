'use strict';
module.exports = (sequelize, DataTypes) => {
  var reported = sequelize.define('reported', {
    LfdNr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: DataTypes.INTEGER,
    FragenID: DataTypes.INTEGER
  }, { freezeTableName: true, timestamps: false });
  reported.associate = function(models) {
    reported.belongsTo(models.users, {foreignKey: 'UserID'});
    reported.belongsTo(models.fragen, {foreignKey: 'FragenID'});
  };
  return reported;
};
