'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define('Question', {
    text: DataTypes.STRING
  }, {});
  Question.associate = function(models) {
    Question.belongsTo(models.Category);
    Question.hasMany(models.Answer);
    Question.hasMany(models.Report);
  };
  return Question;
};
