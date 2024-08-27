'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class create - templates - table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  create - templates - table.init({
    title: DataTypes.STRING,
    widgets: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'create-templates-table',
  });
  return create - templates - table;
};