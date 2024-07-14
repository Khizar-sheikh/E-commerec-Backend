'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Collection, { foreignKey: 'collectionId' });
      Product.hasMany(models.ProductVariant, { foreignKey: 'productId' });
      Product.hasMany(models.Review, { foreignKey: 'productId' });
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Collections',
        key: 'id'
      }
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    soldCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};
