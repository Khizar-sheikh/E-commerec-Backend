'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Collection belongs to a SubCategory
      Collection.belongsTo(models.SubCategory, { foreignKey: 'subCategoryId' });

      // A Collection has many Products, with foreign key collectionId in Products table
      Collection.hasMany(models.Product, { foreignKey: 'collectionId' });
    }
  }

  Collection.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SubCategories', // references the 'SubCategories' table
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Collection',
  });

  return Collection;
};
