'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Add foreign key constraint for cartId in CartItems
    await queryInterface.addConstraint('CartItems', {
      fields: ['cartId'],
      type: 'foreign key',
      name: 'cartitems-cart-association',
      references: {
        table: 'Carts',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Add foreign key constraint for cartId in CartItems
    await queryInterface.addConstraint('CartItems', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'cartitems-product-association',
      references: {
        table: 'Products',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

  // Add foreign key constraint for cartId in CartItems
    await queryInterface.addConstraint('CartItems', {
      fields: ['productVariantId'],
      type: 'foreign key',
      name: 'cartitems-productVariant-association',
      references: {
        table: 'ProductVariants',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {

    // Remove foreign key constraint for userId in Carts table
    await queryInterface.removeConstraint('CartItems', 'cartitems-cart-association');

    // Remove foreign key constraint for userId in Carts table
    await queryInterface.removeConstraint('CartItems', 'cartitems-product-association');

    // Remove foreign key constraint for userId in Carts table
    await queryInterface.removeConstraint('CartItems', 'cartitems-productVariant-association');
  }
};
