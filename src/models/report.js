'use strict';
module.exports = (sequelize, DataTypes) => {
  var report = sequelize.define('report', {
    LfdNr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: DataTypes.INTEGER,
    FragenID: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'reported',
  });
  report.associate = function(models) {
    report.belongsTo(models.users, {foreignKey: 'UserID'});
    report.belongsTo(models.question, {foreignKey: 'FragenID'});
  };
  return report;
};
