'use strict';
module.exports = (sequelize, DataTypes) => {
  var statistics = sequelize.define('statistics', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    FachgebietID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Fragen_richtig: DataTypes.INTEGER,
    Fragen_falsch: DataTypes.INTEGER,
    Datum: DataTypes.DATE
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'statistic_user_fachgebiete',
  });
  statistics.associate = function(models) {
    statistics.belongsTo(models.users, { foreignKey: 'UserID' });
    statistics.belongsTo(models.category, { foreignKey: 'FachgebietID' });
  };
  return statistics;
};
