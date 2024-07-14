'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // An Order belongs to a User
      Order.belongsTo(models.User, { foreignKey: 'userId' });

      // An Order has many OrderItems
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
    }
  }

  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // references the 'Users' table
        key: 'id'
      }
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      allowNull: false,
      defaultValue: 'Pending' // Default status for a new order
    },
    addressEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressCountry: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressFirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressLastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressState: {
      type: DataTypes.STRING,
      allowNull: true // Assuming addressState is optional
    },
    addressAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressStreet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressPostalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressPhone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
