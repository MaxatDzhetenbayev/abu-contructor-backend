'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('navigations', 'is_visible', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('navigations', 'is_visible');
  },
};
