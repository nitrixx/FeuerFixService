'use strict';
module.exports = (sequelize, DataTypes) => {
  var Answer = sequelize.define('Answer', {
    text: DataTypes.STRING,
    isCorrect: DataTypes.BOOLEAN
  }, {});
  Answer.associate = function(models) {
    Answer.belongsTo(models.Question);
    Answer.belongsToMany(models.User, { through: models.AnsweredQuestion });
  };
  return Answer;
};
