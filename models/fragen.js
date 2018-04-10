'use strict';
module.exports = (sequelize, DataTypes) => {
  var fragen = sequelize.define('fragen', {
    FragenID: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FachgebietID: DataTypes.INTEGER,
    Frage: DataTypes.STRING,
    Antwort_A: DataTypes.STRING,
    Antwort_B: DataTypes.STRING,
    Antwort_C: DataTypes.STRING,
    richtige_antwort: DataTypes.STRING,
    version: DataTypes.STRING
  }, { freezeTableName: true, timestamps: false, });
  fragen.associate = function(models) {
    fragen.belongsTo(models.fachgebiete, {foreignKey: 'FachgebietID'});
  };
  return fragen;
};
