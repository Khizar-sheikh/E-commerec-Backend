'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Add foreign key constraint for userId in Carts table
    await queryInterface.addConstraint('Carts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'cart-user-association',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

  },

  async down(queryInterface, Sequelize) {
    // Remove cartId column from CartItems table
    await queryInterface.removeConstraint('Carts', 'cart-user-association');
  }
};
