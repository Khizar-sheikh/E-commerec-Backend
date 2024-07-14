'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Associations
      SubCategory.belongsTo(models.Category, { foreignKey: 'categoryId' });
      SubCategory.hasMany(models.Product, { foreignKey: 'subCategoryId' });
    }
  }

  SubCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories', // references the 'Categories' table
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'SubCategory',
  });

  return SubCategory;
};
