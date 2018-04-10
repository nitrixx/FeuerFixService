'use strict';
module.exports = (sequelize, DataTypes) => {
  var statistic = sequelize.define('statistic', {
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
  statistic.associate = function(models) {
    statistic.belongsTo(models.users, { foreignKey: 'UserID' });
    statistic.belongsTo(models.category, { foreignKey: 'FachgebietID' });
  };
  return statistic;
};
