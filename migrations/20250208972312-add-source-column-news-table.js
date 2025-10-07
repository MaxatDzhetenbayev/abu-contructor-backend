'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('news', 'source', {
      type: Sequelize.ENUM('ai', 'abu', 'all'),
      defaultValue: 'abu',
      allowNull: false,
    });
  },

  async down(queryInterface) {
    queryInterface.removeColumn('news', 'source');
  },
};
