'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Cart belongs to a User
      Cart.belongsTo(models.User, { foreignKey: 'userId' });

      // A Cart has many CartItems
      Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
    }
  }

  Cart.init({
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
      allowNull: true // Assuming totalPrice can be null until items are added
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });

  return Cart;
};
