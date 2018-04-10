'use strict';
module.exports = (sequelize, DataTypes) => {
  var question = sequelize.define('question', {
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
  question.associate = function(models) {
    question.belongsTo(models.category, {foreignKey: 'FachgebietID'});
    question.belongsToMany(models.users, { through: 'reported', foreignKey: 'FragenID' });
  };
  return question;
};
