'use strict';

const sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('news', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: sequelize.JSONB,
      content: sequelize.JSONB,
      viewCount: {
        type: sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('news')
  }
};
