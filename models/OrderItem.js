'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // An OrderItem belongs to an Order
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });

      // An OrderItem belongs to a Product
      OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });

      // An OrderItem belongs to a ProductVariant
      OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'productVariantId' });
    }
  }

  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders', // references the 'Orders' table
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products', // references the 'Products' table
        key: 'id'
      }
    },
    productVariantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProductVariants', // references the 'ProductVariants' table
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 // assuming default quantity is 1
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
  });

  return OrderItem;
};
