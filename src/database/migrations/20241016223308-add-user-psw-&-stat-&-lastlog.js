'use strict';
import { DataTypes } from 'sequelize';
const { UserStatus } = require('../../common/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'passwordHash', {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'status', {
      type: DataTypes.STRING,
      defaultValue: UserStatus.Created,
    });
    await queryInterface.addColumn('Users', 'lastLogin', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'passwordHash');
    await queryInterface.removeColumn('Users', 'status');
    await queryInterface.removeColumn('Users', 'lastLogin');
  },
};
