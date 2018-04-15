'use strict';
module.exports = (sequelize, DataTypes) => {
  var AnsweredQuestion = sequelize.define('AnsweredQuestion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  }, {});
  AnsweredQuestion.associate = function(models) {
    AnsweredQuestion.belongsTo(models.User);
    AnsweredQuestion.belongsTo(models.Answer);
  };
  return AnsweredQuestion;
};
