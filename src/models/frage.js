'use strict';
module.exports = (sequelize, DataTypes) => {
  var frage = sequelize.define('frage', {
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
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'fragen',
  });
  frage.associate = function(models) {
    frage.belongsTo(models.category, {foreignKey: 'FachgebietID'});
    frage.belongsToMany(models.users, { through: 'reported', foreignKey: 'FragenID' });
  };
  return frage;
};
