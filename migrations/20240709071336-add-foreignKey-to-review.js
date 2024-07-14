'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint for productId in Review table
    await queryInterface.addConstraint('Reviews', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'FK_Review_ProductId',
      references: {
        table: 'Products',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Add foreign key constraint for userId in Review table
    await queryInterface.addConstraint('Reviews', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'FK_Review_UserId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints in the down migration if needed
    await queryInterface.removeConstraint('Reviews', 'FK_Review_ProductId');
    await queryInterface.removeConstraint('Reviews', 'FK_Review_UserId');
  }
};
