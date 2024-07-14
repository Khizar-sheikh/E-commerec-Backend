'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint for categoryId in SubCategory table
    await queryInterface.addConstraint('SubCategories', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'FK_SubCategory_CategoryId',
      references: {
        table: 'Categories',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint in the down migration if needed
    await queryInterface.removeConstraint('SubCategories', 'FK_SubCategory_CategoryId');
  }
};
