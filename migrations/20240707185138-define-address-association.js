'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define association
    await queryInterface.addConstraint('Addresses', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'address-user-association',
      references: {
        table: 'Users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove association constraint
    await queryInterface.removeConstraint('Addresses', 'address-user-association');
  }
};
