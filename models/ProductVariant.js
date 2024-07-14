'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A ProductVariant belongs to a Product
      ProductVariant.belongsTo(models.Product, { foreignKey: 'productId' });

      // A ProductVariant belongs to a Size
      ProductVariant.belongsTo(models.Size, { foreignKey: 'sizeId' });

      // A ProductVariant has many OrderItems
      ProductVariant.hasMany(models.OrderItem, { foreignKey: 'productVariantId' });
    }
  }

  ProductVariant.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products', // references the 'Products' table
        key: 'id'
      }
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sizes', // references the 'Sizes' table
        key: 'id'
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 // assuming default stock is 0 until updated
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true // SKU can be optional
    }
  }, {
    sequelize,
    modelName: 'ProductVariant',
  });

  return ProductVariant;
};
