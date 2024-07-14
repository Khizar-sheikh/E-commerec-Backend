'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      // A Size has many ProductVariants
      Size.hasMany(models.ProductVariant, { foreignKey: 'sizeId' });
    }
  }

  Size.init({
    name: DataTypes.STRING,
    abbr: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Size',
  });

  return Size;
};
