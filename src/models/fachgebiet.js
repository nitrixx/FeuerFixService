'use strict';
module.exports = (sequelize, DataTypes) => {
  var fachgebiet = sequelize.define('fachgebiet', {
    FachgebietID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FachgebietName: DataTypes.STRING,
    version: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'fachgebiete',
  });
  fachgebiet.associate = function(models) {
    fachgebiet.hasMany(models.frage, {foreignKey: 'FachgebietID'});
    fachgebiet.hasMany(models.statistics, { foreignKey: 'FachgebietID' });
  };
  return fachgebiet;
};
