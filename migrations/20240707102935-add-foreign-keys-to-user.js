'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add addressId column to Users with UUID type
    await queryInterface.addColumn('Users', 'addressId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Addresses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add orderId column to Users with UUID type
    await queryInterface.addColumn('Users', 'orderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add reviewId column to Users with UUID type
    await queryInterface.addColumn('Users', 'reviewId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Reviews',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add cartId column to Users with UUID type
    await queryInterface.addColumn('Users', 'cartId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Carts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove addressId column from Users
    await queryInterface.removeColumn('Users', 'addressId');

    // Remove orderId column from Users
    await queryInterface.removeColumn('Users', 'orderId');

    // Remove reviewId column from Users
    await queryInterface.removeColumn('Users', 'reviewId');

    // Remove cartId column from Users
    await queryInterface.removeColumn('Users', 'cartId');
  }
};
