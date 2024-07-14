'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // An Address belongs to a User
      Address.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Address.init({
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // references the 'Users' table
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Address',
  });

  return Address;
};
