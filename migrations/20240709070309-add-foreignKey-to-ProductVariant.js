'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding foreign key constraint for 'productId'
    await queryInterface.addConstraint('ProductVariants', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'FK_ProductVariant_ProductId',
      references: {
        table: 'Products',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Adding foreign key constraint for 'sizeId'
    await queryInterface.addConstraint('ProductVariants', {
      fields: ['sizeId'],
      type: 'foreign key',
      name: 'FK_ProductVariant_SizeId',
      references: {
        table: 'Sizes',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Removing the foreign key constraints
    await queryInterface.removeConstraint('ProductVariants', 'FK_ProductVariant_ProductId');
    await queryInterface.removeConstraint('ProductVariants', 'FK_ProductVariant_SizeId');
  }
};
