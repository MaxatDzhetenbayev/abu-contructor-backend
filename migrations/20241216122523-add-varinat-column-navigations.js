'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('navigations', 'variant', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'horizontal',
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('navigations', 'variant');
  },
};
