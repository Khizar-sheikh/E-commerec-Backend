'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    //Add Cart Id to Order
    await queryInterface.addConstraint('OrderItems', {
      type: 'foreign key',
      fields: ['orderId'],
      name: 'orderItems-order-association',
      references: {
        table: 'Orders',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    //Add Product Id to Order
    await queryInterface.addConstraint('OrderItems', {
      type: 'foreign key',
      fields: ['productId'],
      name: 'orderItems-product-association',
      references: {
        table: 'Products',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    //Add Product Variant Id to Order
    await queryInterface.addConstraint('OrderItems', {
      type: 'foreign key',
      fields: ['productVariantId'],
      name: 'orderItems-productVariant-association',
      references: {
        table: 'ProductVariants',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

  },

  async down(queryInterface, Sequelize) {

    // Remove foreign Key Constraint for cartId in orderItems Table  
     await queryInterface.removeConstraint('OrderItems' , 'orderItems-order-association' )

    // Remove foreign Key Constraint for productId in orderItems Table  
    await queryInterface.removeConstraint('OrderItems' , 'orderItems-product-association' )

    // Remove foreign Key Constraint for productVariantId in orderItems Table  
    await queryInterface.removeConstraint('OrderItems' , 'orderItems-productVariant-association' )


  }
};
