'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Review belongs to a Product
      Review.belongsTo(models.Product, { foreignKey: 'productId' });

      // A Review belongs to a User
      Review.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Review.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products', // references the 'Products' table
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // references the 'Users' table
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true // Comment can be optional
    }
  }, {
    sequelize,
    modelName: 'Review',
  });

  return Review;
};
