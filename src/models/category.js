'use strict';
module.exports = (sequelize, DataTypes) => {
  var category = sequelize.define('category', {
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
  category.associate = function(models) {
    category.hasMany(models.frage, {foreignKey: 'FachgebietID'});
    category.hasMany(models.statistics, { foreignKey: 'FachgebietID' });
  };
  return category;
};
