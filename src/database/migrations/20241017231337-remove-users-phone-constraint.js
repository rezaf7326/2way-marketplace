'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'Users_phone_key');
  },

  async down(queryInterface, Sequelize) {
    // nothing!
  },
};
