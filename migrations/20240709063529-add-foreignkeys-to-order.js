'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    //Add foreign Key Constraint for userId in Order Table 
    await queryInterface.addConstraint('Orders', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'FK_Orders_Users',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

  },

  async down(queryInterface, Sequelize) {

    //Remove Foreign Key Constraint For UserId in Order Table
    await queryInterface.removeConstraint('Orders', 'FK_Orders_Users')
  }
};
