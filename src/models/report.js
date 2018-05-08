'use strict';
module.exports = (sequelize, DataTypes) => {
  var Report = sequelize.define('Report', {
    message: DataTypes.STRING
  }, {});
  Report.associate = function(models) {
    Report.belongsTo(models.Question);
  };
  return Report;
};
