'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('navigations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true

      },
      title: DataTypes.JSONB,
      slug: Sequelize.STRING,
      order: Sequelize.INTEGER,
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      navigation_type: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
