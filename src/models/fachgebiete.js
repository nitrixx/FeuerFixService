'use strict';
module.exports = (sequelize, DataTypes) => {
  var fachgebiete = sequelize.define('fachgebiete', {
    FachgebietID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FachgebietName: DataTypes.STRING,
    version: DataTypes.INTEGER
  }, { freezeTableName: true, timestamps: false });
  fachgebiete.associate = function(models) {
    fachgebiete.hasMany(models.fragen, {foreignKey: 'FachgebietID'});
  };
  return fachgebiete;
};
