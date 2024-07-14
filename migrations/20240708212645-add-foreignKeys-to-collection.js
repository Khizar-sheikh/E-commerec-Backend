'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    //Add SubCategoryId Constraint to Collection
    await queryInterface.addConstraint('Collections', {
      fields: ['subCategoryId'],
      type: 'foreign key',
      name: 'collection-subCategory-association',
      references: {
        table: 'SubCategories',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint('Collections', 'collection-subCategory-association')
  }
};
