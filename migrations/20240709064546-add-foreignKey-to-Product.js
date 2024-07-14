'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Add Foreign Key Constraint For Collection Id in Product Table 
    await queryInterface.addConstraint('Products', {
      fields: ['collectionId'],
      type: 'foreign key',
      name: 'FK_Products_Collections',
      references: {
        table: 'Collections',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {

    // Remove Foreign Key Constraint For Collection Id in Product Table 
    await queryInterface.removeConstraint('Products', 'FK_Products_Collections')

  }
};
